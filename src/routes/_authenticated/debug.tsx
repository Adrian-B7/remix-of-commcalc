import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  RefreshCw,
  Database,
  Activity,
  Bot,
  Server,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Zap,
  TableIcon,
  Shield,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/debug")({
  component: DebugPage,
});

type Status = "ok" | "error" | "loading" | "warn";

interface HealthCheck {
  name: string;
  status: Status;
  latency?: number;
  detail?: string;
}

interface TableInfo {
  name: string;
  count: number | null;
  error?: string;
  sample?: Record<string, unknown>[];
}

interface AiTestResult {
  status: Status;
  latency?: number;
  model?: string;
  detail?: string;
  response?: string;
}

const DB_TABLES = ["deals", "reps", "comp_plans", "comp_tiers", "quota_tiers", "profiles", "audit_log", "user_roles"] as const;

function DebugPage() {
  const [health, setHealth] = useState<HealthCheck[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [aiTest, setAiTest] = useState<AiTestResult | null>(null);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState<Record<string, unknown> | null>(null);
  const [activeTab, setActiveTab] = useState<"health" | "data" | "ai" | "auth">("health");

  const runHealthChecks = useCallback(async () => {
    const checks: HealthCheck[] = [];

    // 1. Supabase connection
    const dbStart = performance.now();
    try {
      const { error } = await supabase.from("reps").select("id").limit(1);
      const dbLatency = Math.round(performance.now() - dbStart);
      checks.push({
        name: "Database connection",
        status: error ? "error" : "ok",
        latency: dbLatency,
        detail: error ? error.message : `Connected (${dbLatency}ms)`,
      });
    } catch (e) {
      checks.push({ name: "Database connection", status: "error", detail: String(e) });
    }

    // 2. Auth service
    const authStart = performance.now();
    try {
      const { data, error } = await supabase.auth.getSession();
      const authLatency = Math.round(performance.now() - authStart);
      checks.push({
        name: "Auth service",
        status: error ? "error" : data.session ? "ok" : "warn",
        latency: authLatency,
        detail: error ? error.message : data.session ? `Session active (${authLatency}ms)` : "No active session",
      });
    } catch (e) {
      checks.push({ name: "Auth service", status: "error", detail: String(e) });
    }

    // 3. Edge function (ai-chat) reachability
    const efStart = performance.now();
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const resp = await fetch(url, {
        method: "OPTIONS",
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      const efLatency = Math.round(performance.now() - efStart);
      checks.push({
        name: "AI edge function",
        status: resp.ok || resp.status === 204 ? "ok" : "warn",
        latency: efLatency,
        detail: `Status ${resp.status} (${efLatency}ms)`,
      });
    } catch (e) {
      checks.push({ name: "AI edge function", status: "error", detail: String(e) });
    }

    // 4. Realtime
    const rtStart = performance.now();
    try {
      const channel = supabase.channel("debug-ping");
      const sub = channel.subscribe((status) => {
        const rtLatency = Math.round(performance.now() - rtStart);
        checks.push({
          name: "Realtime",
          status: status === "SUBSCRIBED" ? "ok" : "warn",
          latency: rtLatency,
          detail: `${status} (${rtLatency}ms)`,
        });
        setHealth([...checks]);
        supabase.removeChannel(channel);
      });
      // Timeout fallback
      setTimeout(() => {
        if (!checks.find((c) => c.name === "Realtime")) {
          checks.push({ name: "Realtime", status: "warn", detail: "Timeout after 5s" });
          setHealth([...checks]);
          supabase.removeChannel(channel);
        }
      }, 5000);
    } catch (e) {
      checks.push({ name: "Realtime", status: "error", detail: String(e) });
    }

    setHealth(checks);
  }, []);

  const loadTableData = useCallback(async () => {
    const results: TableInfo[] = [];
    for (const table of DB_TABLES) {
      try {
        const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
        if (error) {
          results.push({ name: table, count: null, error: error.message });
        } else {
          results.push({ name: table, count: count ?? 0 });
        }
      } catch (e) {
        results.push({ name: table, count: null, error: String(e) });
      }
    }
    setTables(results);
  }, []);

  const loadTableSample = useCallback(async (table: string) => {
    try {
      const { data, error } = await supabase.from(table).select("*").limit(5).order("created_at", { ascending: false });
      if (!error && data) {
        setTables((prev) =>
          prev.map((t) => (t.name === table ? { ...t, sample: data as Record<string, unknown>[] } : t))
        );
      }
    } catch {}
  }, []);

  const testAi = useCallback(async () => {
    setAiTest({ status: "loading" });
    const start = performance.now();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Reply with exactly: DEBUG_OK" }],
        }),
      });

      const latency = Math.round(performance.now() - start);

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
        setAiTest({ status: "error", latency, detail: err.error || `HTTP ${resp.status}` });
        return;
      }

      // Read first chunk of stream
      if (!resp.body) {
        setAiTest({ status: "error", latency, detail: "No response body" });
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let chunks = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks++;
        const text = decoder.decode(value, { stream: true });
        for (const line of text.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) fullText += content;
          } catch {}
        }
      }

      const totalLatency = Math.round(performance.now() - start);
      setAiTest({
        status: "ok",
        latency: totalLatency,
        model: "google/gemini-3-flash-preview",
        detail: `${chunks} chunks, ${fullText.length} chars`,
        response: fullText.slice(0, 500),
      });
    } catch (e) {
      setAiTest({
        status: "error",
        latency: Math.round(performance.now() - start),
        detail: String(e),
      });
    }
  }, []);

  const loadUserInfo = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      setUserInfo({
        id: session.user.id,
        email: session.user.email,
        provider: session.user.app_metadata?.provider,
        created: session.user.created_at,
        last_sign_in: session.user.last_sign_in_at,
        roles: roles?.map((r) => r.role) ?? [],
        token_expires: new Date((session.expires_at ?? 0) * 1000).toISOString(),
        metadata: session.user.user_metadata,
      });
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([runHealthChecks(), loadTableData(), loadUserInfo()]);
    setIsRefreshing(false);
  }, [runHealthChecks, loadTableData, loadUserInfo]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  function toggleTable(name: string) {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
        // Load sample on first expand
        const t = tables.find((t) => t.name === name);
        if (t && !t.sample) loadTableSample(name);
      }
      return next;
    });
  }

  const StatusIcon = ({ status }: { status: Status }) => {
    if (status === "ok") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    if (status === "error") return <XCircle className="h-4 w-4 text-red-500" />;
    if (status === "warn") return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />;
  };

  const tabs = [
    { id: "health" as const, label: "System health", icon: Activity },
    { id: "data" as const, label: "Data inspector", icon: Database },
    { id: "ai" as const, label: "AI diagnostics", icon: Bot },
    { id: "auth" as const, label: "Auth & session", icon: Shield },
  ];

  const envVars = [
    { key: "VITE_SUPABASE_URL", value: import.meta.env.VITE_SUPABASE_URL },
    { key: "VITE_SUPABASE_PUBLISHABLE_KEY", value: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "••••" + String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY).slice(-8) : "NOT SET" },
    { key: "VITE_SUPABASE_PROJECT_ID", value: import.meta.env.VITE_SUPABASE_PROJECT_ID },
  ];

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Debug console</h1>
          </div>
          <Button variant="outline" size="sm" onClick={refreshAll} disabled={isRefreshing}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Health tab */}
        {activeTab === "health" && (
          <div className="space-y-3">
            {/* Health checks */}
            <div className="border border-border bg-card">
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Service health
                </h2>
              </div>
              <div className="divide-y divide-border">
                {health.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
                    Running checks...
                  </div>
                ) : (
                  health.map((check) => (
                    <div key={check.name} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <StatusIcon status={check.status} />
                        <span className="text-sm font-medium">{check.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {check.latency != null && (
                          <Badge variant="secondary" className="font-mono text-xs">
                            {check.latency}ms
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground max-w-[300px] truncate">
                          {check.detail}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Env vars */}
            <div className="border border-border bg-card">
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <h2 className="text-sm font-semibold">Environment variables</h2>
              </div>
              <div className="divide-y divide-border">
                {envVars.map((v) => (
                  <div key={v.key} className="flex items-center justify-between px-4 py-2.5">
                    <code className="text-xs font-mono text-muted-foreground">{v.key}</code>
                    <code className="text-xs font-mono">{v.value || "NOT SET"}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Browser info */}
            <div className="border border-border bg-card">
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <h2 className="text-sm font-semibold">Client info</h2>
              </div>
              <div className="px-4 py-3 grid grid-cols-2 gap-2 text-xs">
                <span className="text-muted-foreground">User agent</span>
                <span className="font-mono truncate">{navigator.userAgent.slice(0, 80)}...</span>
                <span className="text-muted-foreground">Viewport</span>
                <span className="font-mono">{window.innerWidth}×{window.innerHeight}</span>
                <span className="text-muted-foreground">Pixel ratio</span>
                <span className="font-mono">{window.devicePixelRatio}</span>
                <span className="text-muted-foreground">Online</span>
                <span className="font-mono">{navigator.onLine ? "Yes" : "No"}</span>
                <span className="text-muted-foreground">Timestamp</span>
                <span className="font-mono">{new Date().toISOString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Data tab */}
        {activeTab === "data" && (
          <div className="space-y-2">
            <div className="border border-border bg-card">
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <TableIcon className="h-4 w-4" />
                  Database tables
                  <Badge variant="secondary" className="ml-auto">{tables.length} tables</Badge>
                </h2>
              </div>
              <div className="divide-y divide-border">
                {tables.map((t) => (
                  <div key={t.name}>
                    <button
                      onClick={() => toggleTable(t.name)}
                      className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted/30 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        {expandedTables.has(t.name) ? (
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <code className="text-sm font-mono font-medium">{t.name}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        {t.error ? (
                          <Badge variant="destructive" className="text-xs">{t.error}</Badge>
                        ) : (
                          <Badge variant="secondary" className="font-mono text-xs">
                            {t.count ?? "?"} rows
                          </Badge>
                        )}
                      </div>
                    </button>
                    {expandedTables.has(t.name) && (
                      <div className="px-4 pb-3">
                        {t.sample ? (
                          t.sample.length > 0 ? (
                            <div className="overflow-x-auto border border-border">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-muted">
                                    {Object.keys(t.sample[0]).map((col) => (
                                      <th key={col} className="px-2 py-1.5 text-left font-semibold border-b border-border whitespace-nowrap">
                                        {col}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {t.sample.map((row, i) => (
                                    <tr key={i} className="border-b border-border last:border-0">
                                      {Object.values(row).map((val, j) => (
                                        <td key={j} className="px-2 py-1.5 font-mono whitespace-nowrap max-w-[200px] truncate">
                                          {val === null ? <span className="text-muted-foreground italic">null</span> : String(val)}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">Empty table</p>
                          )
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Loading sample...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI tab */}
        {activeTab === "ai" && (
          <div className="space-y-3">
            <div className="border border-border bg-card">
              <div className="px-4 py-3 border-b border-border bg-muted/50 flex items-center justify-between">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  AI gateway test
                </h2>
                <Button variant="outline" size="sm" onClick={testAi} disabled={aiTest?.status === "loading"}>
                  {aiTest?.status === "loading" ? (
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Zap className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  Run test
                </Button>
              </div>
              <div className="p-4">
                {!aiTest ? (
                  <p className="text-sm text-muted-foreground">Click "Run test" to send a test message to the AI gateway.</p>
                ) : aiTest.status === "loading" ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sending test message...
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <StatusIcon status={aiTest.status} />
                      <span className="text-sm font-medium">
                        {aiTest.status === "ok" ? "AI responding" : "AI error"}
                      </span>
                      {aiTest.latency != null && (
                        <Badge variant="secondary" className="font-mono text-xs">
                          {aiTest.latency}ms
                        </Badge>
                      )}
                    </div>
                    {aiTest.model && (
                      <div className="text-xs text-muted-foreground">
                        Model: <code className="font-mono">{aiTest.model}</code>
                      </div>
                    )}
                    {aiTest.detail && (
                      <div className="text-xs text-muted-foreground">{aiTest.detail}</div>
                    )}
                    {aiTest.response && (
                      <div className="mt-2 p-3 bg-muted text-xs font-mono whitespace-pre-wrap border border-border">
                        {aiTest.response}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* AI config summary */}
            <div className="border border-border bg-card">
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <h2 className="text-sm font-semibold">AI configuration</h2>
              </div>
              <div className="px-4 py-3 grid grid-cols-2 gap-2 text-xs">
                <span className="text-muted-foreground">Gateway</span>
                <code className="font-mono">ai.gateway.lovable.dev</code>
                <span className="text-muted-foreground">Model</span>
                <code className="font-mono">google/gemini-3-flash-preview</code>
                <span className="text-muted-foreground">Streaming</span>
                <span className="font-mono">Enabled (SSE)</span>
                <span className="text-muted-foreground">Edge function</span>
                <code className="font-mono">ai-chat</code>
                <span className="text-muted-foreground">Context tables</span>
                <code className="font-mono">deals, reps, comp_plans, comp_tiers, quota_tiers</code>
              </div>
            </div>
          </div>
        )}

        {/* Auth tab */}
        {activeTab === "auth" && (
          <div className="space-y-3">
            <div className="border border-border bg-card">
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Current session
                </h2>
              </div>
              {userInfo ? (
                <div className="px-4 py-3 grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(userInfo).map(([key, val]) => (
                    <React.Fragment key={key}>
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-mono truncate max-w-[400px]">
                        {Array.isArray(val) ? val.join(", ") || "(none)" : typeof val === "object" ? JSON.stringify(val) : String(val)}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm text-muted-foreground">No session data</div>
              )}
            </div>

            {/* RLS summary */}
            <div className="border border-border bg-card">
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <h2 className="text-sm font-semibold">RLS policy summary</h2>
              </div>
              <div className="divide-y divide-border text-xs">
                {[
                  { table: "deals", read: "auth (active)", write: "auth", delete: "—" },
                  { table: "reps", read: "auth", write: "auth", delete: "auth" },
                  { table: "comp_plans", read: "auth", write: "admin", delete: "—" },
                  { table: "comp_tiers", read: "auth", write: "admin", delete: "admin" },
                  { table: "quota_tiers", read: "auth", write: "admin", delete: "—" },
                  { table: "profiles", read: "auth", write: "own", delete: "—" },
                  { table: "audit_log", read: "admin", write: "—", delete: "—" },
                  { table: "user_roles", read: "admin/own", write: "admin", delete: "admin" },
                ].map((r) => (
                  <div key={r.table} className="flex items-center px-4 py-2 gap-4">
                    <code className="font-mono font-medium w-28">{r.table}</code>
                    <Badge variant="secondary" className="text-[10px]">R: {r.read}</Badge>
                    <Badge variant="secondary" className="text-[10px]">W: {r.write}</Badge>
                    <Badge variant="secondary" className="text-[10px]">D: {r.delete}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
