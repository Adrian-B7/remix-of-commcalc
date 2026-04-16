import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  TrendingUp,
  ArrowLeft,
  GripVertical,
  BarChart3,
  Calculator,
  Users,
  Settings,
  Layers,
  DollarSign,
  Globe,
  Calendar,
  Zap,
  Shield,
  Target,
  RotateCcw,
  UserPlus,
  Briefcase,
  PieChart,
  Clock,
  CheckCircle,
  TrendingDown,
  AlertTriangle,
  FileText,
  ArrowUpRight,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DealKanban } from "@/components/demo/DealKanban";
import { SortableLeaderboard } from "@/components/demo/SortableLeaderboard";
import { CommissionCalculator } from "@/components/demo/CommissionCalculator";
import { OrgChart } from "@/components/demo/OrgChart";
import { PerformanceCharts } from "@/components/demo/PerformanceCharts";
import { CompTierBuilder } from "@/components/demo/CompTierBuilder";
import { TaxEstimator } from "@/components/demo/TaxEstimator";
import { CurrencyConverter, PayoutTimeline, ScenarioModeler } from "@/components/demo/FinancialTools";
import { PipelineVelocity, WinLossAnalysis, DealAging, TerritoryHeatmap } from "@/components/demo/AnalyticsTools";
import { SplitCommissionCalc, ClawbackCalculator, SpifBuilder, RampSchedule, ManagerOverrideCalc } from "@/components/demo/CompensationTools";
import { HeadcountPlanner, ROICalculator, ComplianceChecklist, QuotaPlanner, RevenueForecast, ExpenseTracker, YTDEarnings } from "@/components/demo/OperationsTools";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
  head: () => ({
    meta: [
      { title: "Interactive Demo — CommCalc" },
      { name: "description", content: "Comprehensive interactive demo: drag-and-drop pipeline, commission calculator, tax estimator, org charts, analytics, and 20+ enterprise tools." },
    ],
  }),
});

type SectionCategory = "pipeline" | "compensation" | "analytics" | "financial" | "operations";

const categoryMeta: Record<SectionCategory, { label: string; color: string; description: string }> = {
  pipeline: { label: "Pipeline & Deals", color: "text-primary", description: "Manage deals through stages with drag-and-drop" },
  compensation: { label: "Compensation Engine", color: "text-[#7C5CFC]", description: "Calculate, split, and manage commission structures" },
  analytics: { label: "Analytics & Insights", color: "text-[#F59E0B]", description: "Deep-dive into performance, velocity, and trends" },
  financial: { label: "Financial Planning", color: "text-primary", description: "Tax estimation, currency conversion, and forecasting" },
  operations: { label: "Operations & Planning", color: "text-muted-foreground", description: "Headcount, compliance, budgets, and ROI" },
};

const sections = [
  // Pipeline & Deals
  { id: "pipeline", icon: Layers, label: "Deal Pipeline", category: "pipeline" as SectionCategory, description: "Drag deals between stages" },
  { id: "leaderboard", icon: Users, label: "Leaderboard", category: "pipeline" as SectionCategory, description: "Sortable rep rankings" },
  { id: "org", icon: Users, label: "Org Chart", category: "pipeline" as SectionCategory, description: "Expandable team hierarchy" },

  // Compensation Engine
  { id: "calculator", icon: Calculator, label: "Commission Calc", category: "compensation" as SectionCategory, description: "Real-time commission formula" },
  { id: "tiers", icon: Settings, label: "Tier Builder", category: "compensation" as SectionCategory, description: "Drag to reorder tiers" },
  { id: "split", icon: Users, label: "Split Commission", category: "compensation" as SectionCategory, description: "Multi-rep deal splits" },
  { id: "clawback", icon: RotateCcw, label: "Clawback Calc", category: "compensation" as SectionCategory, description: "Pro-rated commission recovery" },
  { id: "spif", icon: Zap, label: "SPIF Builder", category: "compensation" as SectionCategory, description: "Special incentive programs" },
  { id: "ramp", icon: UserPlus, label: "Ramp Schedule", category: "compensation" as SectionCategory, description: "New hire quota ramp" },
  { id: "override", icon: Briefcase, label: "Manager Override", category: "compensation" as SectionCategory, description: "Management commission layer" },

  // Analytics
  { id: "charts", icon: BarChart3, label: "Performance", category: "analytics" as SectionCategory, description: "Revenue charts & breakdown" },
  { id: "velocity", icon: TrendingUp, label: "Pipeline Velocity", category: "analytics" as SectionCategory, description: "Sales cycle metrics" },
  { id: "winloss", icon: Target, label: "Win/Loss", category: "analytics" as SectionCategory, description: "Deal outcome analysis" },
  { id: "aging", icon: Clock, label: "Deal Aging", category: "analytics" as SectionCategory, description: "Pipeline health by age" },
  { id: "territory", icon: MapPin, label: "Territory Map", category: "analytics" as SectionCategory, description: "Regional performance" },

  // Financial
  { id: "tax", icon: Shield, label: "Tax Estimator", category: "financial" as SectionCategory, description: "Federal, state & FICA" },
  { id: "currency", icon: Globe, label: "Currency Convert", category: "financial" as SectionCategory, description: "Multi-currency deals" },
  { id: "payout", icon: Calendar, label: "Payout Timeline", category: "financial" as SectionCategory, description: "Monthly pay schedule" },
  { id: "scenario", icon: TrendingDown, label: "What-If Models", category: "financial" as SectionCategory, description: "Scenario planning" },
  { id: "ytd", icon: DollarSign, label: "YTD Earnings", category: "financial" as SectionCategory, description: "Cumulative compensation" },

  // Operations
  { id: "forecast", icon: ArrowUpRight, label: "Forecast", category: "operations" as SectionCategory, description: "Revenue projections" },
  { id: "quota", icon: Target, label: "Quota Planner", category: "operations" as SectionCategory, description: "Annual quota distribution" },
  { id: "headcount", icon: Users, label: "Headcount Plan", category: "operations" as SectionCategory, description: "Team capacity planning" },
  { id: "roi", icon: PieChart, label: "ROI Calculator", category: "operations" as SectionCategory, description: "Tool investment returns" },
  { id: "expense", icon: FileText, label: "Expense Tracker", category: "operations" as SectionCategory, description: "Sales org budget" },
  { id: "compliance", icon: CheckCircle, label: "Compliance", category: "operations" as SectionCategory, description: "Policy audit checklist" },
];

function SectionCard({
  id,
  icon: Icon,
  label,
  description,
  iconBg,
  iconColor,
  children,
}: {
  id: string;
  icon: typeof Calculator;
  label: string;
  description: string;
  iconBg: string;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <Card className="border-border/40">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
              <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">{label}</CardTitle>
              <p className="text-[10px] text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </section>
  );
}

function DemoPage() {
  const [activeCategory, setActiveCategory] = useState<SectionCategory | "all">("all");

  const filteredSections = activeCategory === "all" ? sections : sections.filter((s) => s.category === activeCategory);
  const categories = Object.entries(categoryMeta) as [SectionCategory, typeof categoryMeta[SectionCategory]][];

  const colorMap: Record<SectionCategory, { bg: string; text: string }> = {
    pipeline: { bg: "bg-primary/10", text: "text-primary" },
    compensation: { bg: "bg-[#7C5CFC]/10", text: "text-[#7C5CFC]" },
    analytics: { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]" },
    financial: { bg: "bg-primary/10", text: "text-primary" },
    operations: { bg: "bg-muted-foreground/10", text: "text-muted-foreground" },
  };

  function renderSection(s: typeof sections[0]) {
    const colors = colorMap[s.category];
    const props = { id: s.id, icon: s.icon, label: s.label, description: s.description, iconBg: colors.bg, iconColor: colors.text };

    switch (s.id) {
      case "pipeline": return <SectionCard key={s.id} {...props}><DealKanban /></SectionCard>;
      case "leaderboard": return <SectionCard key={s.id} {...props}><SortableLeaderboard /></SectionCard>;
      case "org": return <SectionCard key={s.id} {...props}><OrgChart /></SectionCard>;
      case "calculator": return <SectionCard key={s.id} {...props}><CommissionCalculator /></SectionCard>;
      case "tiers": return <SectionCard key={s.id} {...props}><CompTierBuilder /></SectionCard>;
      case "split": return <SectionCard key={s.id} {...props}><SplitCommissionCalc /></SectionCard>;
      case "clawback": return <SectionCard key={s.id} {...props}><ClawbackCalculator /></SectionCard>;
      case "spif": return <SectionCard key={s.id} {...props}><SpifBuilder /></SectionCard>;
      case "ramp": return <SectionCard key={s.id} {...props}><RampSchedule /></SectionCard>;
      case "override": return <SectionCard key={s.id} {...props}><ManagerOverrideCalc /></SectionCard>;
      case "charts": return <SectionCard key={s.id} {...props}><PerformanceCharts /></SectionCard>;
      case "velocity": return <SectionCard key={s.id} {...props}><PipelineVelocity /></SectionCard>;
      case "winloss": return <SectionCard key={s.id} {...props}><WinLossAnalysis /></SectionCard>;
      case "aging": return <SectionCard key={s.id} {...props}><DealAging /></SectionCard>;
      case "territory": return <SectionCard key={s.id} {...props}><TerritoryHeatmap /></SectionCard>;
      case "tax": return <SectionCard key={s.id} {...props}><TaxEstimator /></SectionCard>;
      case "currency": return <SectionCard key={s.id} {...props}><CurrencyConverter /></SectionCard>;
      case "payout": return <SectionCard key={s.id} {...props}><PayoutTimeline /></SectionCard>;
      case "scenario": return <SectionCard key={s.id} {...props}><ScenarioModeler /></SectionCard>;
      case "ytd": return <SectionCard key={s.id} {...props}><YTDEarnings /></SectionCard>;
      case "forecast": return <SectionCard key={s.id} {...props}><RevenueForecast /></SectionCard>;
      case "quota": return <SectionCard key={s.id} {...props}><QuotaPlanner /></SectionCard>;
      case "headcount": return <SectionCard key={s.id} {...props}><HeadcountPlanner /></SectionCard>;
      case "roi": return <SectionCard key={s.id} {...props}><ROICalculator /></SectionCard>;
      case "expense": return <SectionCard key={s.id} {...props}><ExpenseTracker /></SectionCard>;
      case "compliance": return <SectionCard key={s.id} {...props}><ComplianceChecklist /></SectionCard>;
      default: return null;
    }
  }

  // Group sections by category for rendering
  const groupedSections = categories
    .filter(([cat]) => activeCategory === "all" || activeCategory === cat)
    .map(([cat, meta]) => ({
      category: cat,
      meta,
      items: filteredSections.filter((s) => s.category === cat),
    }))
    .filter((g) => g.items.length > 0);

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
            <span className="hidden sm:inline text-[10px] text-muted-foreground bg-muted/30 rounded px-2 py-1">
              {sections.length} interactive modules
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
          Enterprise-grade sales compensation
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          {sections.length} fully interactive modules — drag-and-drop pipelines, real-time commission calculators,
          tax estimators, scenario modeling, compliance tracking, and more. Everything a revenue operations team needs.
        </p>

        {/* Category filter */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === "all"
                ? "bg-foreground text-background"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            All ({sections.length})
          </button>
          {categories.map(([cat, meta]) => {
            const count = sections.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {meta.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Quick jump nav */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 max-w-4xl mx-auto">
          {filteredSections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-1 rounded border border-border/30 bg-card px-2 py-1 text-[10px] font-medium transition-colors hover:bg-primary/5 hover:border-primary/30"
            >
              <s.icon className={`h-2.5 w-2.5 ${colorMap[s.category].text}`} />
              {s.label}
            </a>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-12">
        {groupedSections.map((group) => (
          <div key={group.category}>
            {/* Category header */}
            <div className="mb-6 flex items-center gap-3">
              <div className={`h-1 w-8 rounded-full ${colorMap[group.category].bg.replace("/10", "")}`} />
              <div>
                <h2 className={`text-lg font-semibold ${colorMap[group.category].text}`}>{group.meta.label}</h2>
                <p className="text-xs text-muted-foreground">{group.meta.description}</p>
              </div>
              <span className="ml-auto text-[10px] text-muted-foreground bg-muted/30 rounded px-2 py-0.5">
                {group.items.length} modules
              </span>
            </div>

            {/* Render sections based on how many there are */}
            {group.items.length === 1 ? (
              renderSection(group.items[0])
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {group.items.map((s) => renderSection(s))}
              </div>
            )}
          </div>
        ))}

        {/* CTA */}
        <section className="text-center py-10 border-t border-border/30">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Ready to run this with your data?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Import your reps, deals, and comp plans in under 5 minutes.
            Everything you just explored — powered by your real numbers.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button asChild size="lg" className="px-8 min-h-[44px]">
              <Link to="/login">Get started free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-[44px]">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
