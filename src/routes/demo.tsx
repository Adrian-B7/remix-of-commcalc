import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  ArrowLeft,
  GripVertical,
  BarChart3,
  Calculator,
  Users,
  Settings,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DealKanban } from "@/components/demo/DealKanban";
import { SortableLeaderboard } from "@/components/demo/SortableLeaderboard";
import { CommissionCalculator } from "@/components/demo/CommissionCalculator";
import { OrgChart } from "@/components/demo/OrgChart";
import { PerformanceCharts } from "@/components/demo/PerformanceCharts";
import { CompTierBuilder } from "@/components/demo/CompTierBuilder";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
  head: () => ({
    meta: [
      { title: "Interactive Demo — CommCalc" },
      { name: "description", content: "Try the interactive demo: drag-and-drop deal pipeline, commission calculator, org charts, and performance analytics." },
    ],
  }),
});

const sections = [
  { id: "pipeline", icon: Layers, label: "Deal Pipeline" },
  { id: "calculator", icon: Calculator, label: "Commission Calc" },
  { id: "leaderboard", icon: Users, label: "Leaderboard" },
  { id: "charts", icon: BarChart3, label: "Analytics" },
  { id: "org", icon: Users, label: "Org Chart" },
  { id: "tiers", icon: Settings, label: "Comp Tiers" },
];

function DemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Link>
            </Button>
            <div className="h-5 w-px bg-border/50" />
            <Link to="/" className="flex items-center gap-2 group">
              <TrendingUp className="h-5 w-5 text-primary transition-transform group-hover:scale-105" />
              <span className="text-sm font-semibold tracking-tight">CommCalc</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-muted-foreground mr-2">
              <GripVertical className="inline h-3 w-3 mr-0.5" />
              Drag items to interact
            </span>
            <Button asChild size="sm">
              <Link to="/login">Get started free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border/30 bg-muted/20 px-4 sm:px-6 py-10 sm:py-14 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Interactive Demo
        </span>
        <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">
          See CommCalc in action
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Drag deals between pipeline stages, adjust sliders to calculate commissions,
          reorder leaderboards, explore org charts — all fully interactive.
        </p>
        {/* Quick nav */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-1.5 rounded border border-border/40 bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary/5 hover:border-primary/30"
            >
              <s.icon className="h-3 w-3 text-primary" />
              {s.label}
            </a>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-10">
        {/* Deal Pipeline Kanban */}
        <section id="pipeline">
          <Card className="border-border/40">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Layers className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">Deal Pipeline</CardTitle>
                  <p className="text-[10px] text-muted-foreground">Drag deals between stages to move them through the pipeline</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DealKanban />
            </CardContent>
          </Card>
        </section>

        {/* Commission Calculator */}
        <section id="calculator">
          <Card className="border-border/40">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C5CFC]/10">
                  <Calculator className="h-4 w-4 text-[#7C5CFC]" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">Commission Calculator</CardTitle>
                  <p className="text-[10px] text-muted-foreground">Adjust deal size and quota attainment to see real-time commission calculations</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CommissionCalculator />
            </CardContent>
          </Card>
        </section>

        {/* Two column: Leaderboard + Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sortable Leaderboard */}
          <section id="leaderboard">
            <Card className="border-border/40 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F59E0B]/10">
                    <Users className="h-4 w-4 text-[#F59E0B]" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Rep Leaderboard</CardTitle>
                    <p className="text-[10px] text-muted-foreground">Drag to reorder rankings manually</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SortableLeaderboard />
              </CardContent>
            </Card>
          </section>

          {/* Performance Charts */}
          <section id="charts">
            <Card className="border-border/40 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Performance Analytics</CardTitle>
                    <p className="text-[10px] text-muted-foreground">Hover over bars to see details</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <PerformanceCharts />
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Two column: Org Chart + Comp Tier Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Org Chart */}
          <section id="org">
            <Card className="border-border/40 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Sales Org Chart</CardTitle>
                    <p className="text-[10px] text-muted-foreground">Click to expand/collapse teams and see revenue rollups</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <OrgChart />
              </CardContent>
            </Card>
          </section>

          {/* Comp Tier Builder */}
          <section id="tiers">
            <Card className="border-border/40 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C5CFC]/10">
                    <Settings className="h-4 w-4 text-[#7C5CFC]" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Comp Tier Builder</CardTitle>
                    <p className="text-[10px] text-muted-foreground">Drag to reorder tiers, add or remove compensation levels</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CompTierBuilder />
              </CardContent>
            </Card>
          </section>
        </div>

        {/* CTA */}
        <section className="text-center py-10">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Ready to try it with your data?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Sign up free and import your reps, deals, and comp plans in under 5 minutes.
          </p>
          <Button asChild size="lg" className="mt-6 px-8 min-h-[44px]">
            <Link to="/login">Get started free</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
