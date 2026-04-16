import { useState } from "react";
import { Clock, TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, XCircle, BarChart3 } from "lucide-react";

const pipelineVelocity = {
  avgDealSize: 58400,
  avgCycleLength: 34,
  winRate: 38,
  numOpportunities: 24,
  velocity: 0, // calculated
};
pipelineVelocity.velocity =
  (pipelineVelocity.numOpportunities * pipelineVelocity.avgDealSize * (pipelineVelocity.winRate / 100)) / pipelineVelocity.avgCycleLength;

const stageConversion = [
  { stage: "Lead", count: 245, pct: 100 },
  { stage: "Qualified", count: 156, pct: 63.7 },
  { stage: "Demo", count: 98, pct: 40 },
  { stage: "Proposal", count: 64, pct: 26.1 },
  { stage: "Negotiation", count: 38, pct: 15.5 },
  { stage: "Closed Won", count: 24, pct: 9.8 },
];

const winLossData = [
  { reason: "Price too high", count: 18, pct: 32, type: "loss" },
  { reason: "Chose competitor", count: 14, pct: 25, type: "loss" },
  { reason: "No budget", count: 11, pct: 20, type: "loss" },
  { reason: "Timing", count: 8, pct: 14, type: "loss" },
  { reason: "Internal politics", count: 5, pct: 9, type: "loss" },
];

const winReasons = [
  { reason: "Product fit", count: 42, pct: 38 },
  { reason: "Pricing", count: 28, pct: 25 },
  { reason: "Support quality", count: 22, pct: 20 },
  { reason: "Integration", count: 12, pct: 11 },
  { reason: "Brand trust", count: 7, pct: 6 },
];

const agingBuckets = [
  { range: "0–15 days", count: 8, value: 320000, health: "good" },
  { range: "16–30 days", count: 12, value: 540000, health: "good" },
  { range: "31–60 days", count: 6, value: 280000, health: "warning" },
  { range: "61–90 days", count: 4, value: 190000, health: "danger" },
  { range: "90+ days", count: 3, value: 145000, health: "critical" },
];

const territories = [
  { name: "West Coast", revenue: 485000, quota: 400000, reps: 4, deals: 18 },
  { name: "East Coast", revenue: 392000, quota: 450000, reps: 5, deals: 14 },
  { name: "Midwest", revenue: 218000, quota: 250000, reps: 3, deals: 9 },
  { name: "South", revenue: 176000, quota: 200000, reps: 2, deals: 7 },
  { name: "EMEA", revenue: 312000, quota: 350000, reps: 3, deals: 11 },
  { name: "APAC", revenue: 164000, quota: 200000, reps: 2, deals: 6 },
];

export function PipelineVelocity() {
  return (
    <div className="space-y-4">
      {/* Velocity formula */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
        <p className="text-[10px] font-semibold text-muted-foreground mb-2">Pipeline Velocity Formula</p>
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="rounded bg-card border border-border/30 px-2 py-1">{pipelineVelocity.numOpportunities} opps</span>
          <span className="text-muted-foreground">×</span>
          <span className="rounded bg-card border border-border/30 px-2 py-1">${(pipelineVelocity.avgDealSize / 1000).toFixed(0)}k avg</span>
          <span className="text-muted-foreground">×</span>
          <span className="rounded bg-card border border-border/30 px-2 py-1">{pipelineVelocity.winRate}% win</span>
          <span className="text-muted-foreground">÷</span>
          <span className="rounded bg-card border border-border/30 px-2 py-1">{pipelineVelocity.avgCycleLength}d cycle</span>
          <span className="text-muted-foreground">=</span>
          <span className="rounded bg-primary text-primary-foreground px-2 py-1 font-bold">
            ${(pipelineVelocity.velocity / 1000).toFixed(0)}k/day
          </span>
        </div>
      </div>

      {/* Funnel visualization */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Conversion Funnel</p>
        <div className="space-y-1">
          {stageConversion.map((s, i) => (
            <div key={s.stage} className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-20 text-right shrink-0">{s.stage}</span>
              <div className="flex-1 h-5 rounded bg-muted/30 overflow-hidden relative">
                <div
                  className="h-full rounded bg-primary/70 transition-all flex items-center"
                  style={{ width: `${s.pct}%` }}
                >
                  {s.pct > 15 && (
                    <span className="text-[8px] font-bold text-white ml-1.5">{s.count}</span>
                  )}
                </div>
              </div>
              <span className="text-[9px] font-semibold w-10 text-right">{s.pct}%</span>
              {i > 0 && (
                <span className="text-[8px] text-muted-foreground w-8">
                  ↓{((stageConversion[i].count / stageConversion[i - 1].count) * 100).toFixed(0)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WinLossAnalysis() {
  const [view, setView] = useState<"loss" | "win">("loss");

  const data = view === "loss" ? winLossData : winReasons;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setView("loss")}
          className={`flex items-center gap-1 rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
            view === "loss" ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-muted/30 text-muted-foreground"
          }`}
        >
          <XCircle className="h-3 w-3" /> Loss Reasons
        </button>
        <button
          onClick={() => setView("win")}
          className={`flex items-center gap-1 rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
            view === "win" ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted/30 text-muted-foreground"
          }`}
        >
          <CheckCircle className="h-3 w-3" /> Win Factors
        </button>
      </div>

      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={d.reason} className="flex items-center gap-3">
            <span className="text-xs font-semibold w-4 text-muted-foreground">{i + 1}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold">{d.reason}</span>
                <span className="text-[10px] text-muted-foreground">{d.count} deals · {d.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${view === "loss" ? "bg-destructive/60" : "bg-primary/60"}`}
                  style={{ width: `${d.pct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded border border-primary/20 bg-primary/5 p-2 text-center">
          <CheckCircle className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-[9px] text-muted-foreground">Win Rate</p>
          <p className="text-sm font-bold text-primary">38%</p>
        </div>
        <div className="rounded border border-destructive/20 bg-destructive/5 p-2 text-center">
          <XCircle className="h-4 w-4 text-destructive mx-auto mb-1" />
          <p className="text-[9px] text-muted-foreground">Loss Rate</p>
          <p className="text-sm font-bold text-destructive">62%</p>
        </div>
      </div>
    </div>
  );
}

export function DealAging() {
  const healthColors: Record<string, string> = {
    good: "bg-primary",
    warning: "bg-[#F59E0B]",
    danger: "bg-destructive/70",
    critical: "bg-destructive",
  };

  const healthIcons: Record<string, typeof CheckCircle> = {
    good: CheckCircle,
    warning: Clock,
    danger: AlertTriangle,
    critical: XCircle,
  };

  const totalValue = agingBuckets.reduce((s, b) => s + b.value, 0);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {agingBuckets.map((b) => {
          const Icon = healthIcons[b.health];
          return (
            <div key={b.range} className="flex items-center gap-3">
              <Icon className={`h-3.5 w-3.5 shrink-0 ${
                b.health === "good" ? "text-primary" :
                b.health === "warning" ? "text-[#F59E0B]" : "text-destructive"
              }`} />
              <span className="text-[10px] font-semibold w-20 shrink-0">{b.range}</span>
              <div className="flex-1 h-4 rounded bg-muted/30 overflow-hidden">
                <div
                  className={`h-full rounded ${healthColors[b.health]} transition-all flex items-center`}
                  style={{ width: `${(b.value / totalValue) * 100}%` }}
                >
                  {b.value / totalValue > 0.15 && (
                    <span className="text-[7px] font-bold text-white ml-1">{b.count}</span>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-semibold w-14 text-right">${(b.value / 1000).toFixed(0)}k</span>
            </div>
          );
        })}
      </div>

      <div className="rounded border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-2.5 flex items-start gap-2">
        <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B] mt-0.5 shrink-0" />
        <div>
          <p className="text-[10px] font-semibold">7 deals at risk</p>
          <p className="text-[9px] text-muted-foreground">$335k in pipeline is over 60 days old. Consider re-engagement strategy.</p>
        </div>
      </div>
    </div>
  );
}

export function TerritoryHeatmap() {
  const maxRevenue = Math.max(...territories.map((t) => t.revenue));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {territories.map((t) => {
          const attainment = (t.revenue / t.quota) * 100;
          const intensity = t.revenue / maxRevenue;
          return (
            <div
              key={t.name}
              className="rounded border border-border/30 p-2.5 transition-all hover:shadow-sm"
              style={{
                background: `color-mix(in srgb, var(--primary) ${Math.round(intensity * 30)}%, transparent)`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold">{t.name}</span>
                <span className={`text-[9px] font-bold ${attainment >= 100 ? "text-primary" : attainment >= 80 ? "text-[#F59E0B]" : "text-destructive"}`}>
                  {attainment.toFixed(0)}%
                </span>
              </div>
              <p className="text-sm font-bold">${(t.revenue / 1000).toFixed(0)}k</p>
              <div className="flex items-center justify-between mt-1 text-[8px] text-muted-foreground">
                <span>{t.reps} reps</span>
                <span>{t.deals} deals</span>
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-muted/50 overflow-hidden">
                <div
                  className={`h-full rounded-full ${attainment >= 100 ? "bg-primary" : attainment >= 80 ? "bg-[#F59E0B]" : "bg-destructive/60"}`}
                  style={{ width: `${Math.min(attainment, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
        <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-sm bg-primary" /> ≥100% quota</span>
        <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-sm bg-[#F59E0B]" /> 80–99%</span>
        <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-sm bg-destructive/60" /> &lt;80%</span>
      </div>
    </div>
  );
}
