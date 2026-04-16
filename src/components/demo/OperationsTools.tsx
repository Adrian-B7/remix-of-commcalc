import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Users, DollarSign, TrendingUp, Target, Calculator,
  CheckCircle, Circle, AlertTriangle, BarChart3, ArrowUpRight,
  Clock, FileText, Shield, Briefcase, PieChart,
} from "lucide-react";

export function HeadcountPlanner() {
  const [headcount, setHeadcount] = useState([12]);
  const [avgOTE, setAvgOTE] = useState([180000]);
  const [quotaPerRep, setQuotaPerRep] = useState([400000]);

  const calc = useMemo(() => {
    const totalCost = headcount[0] * avgOTE[0];
    const totalCapacity = headcount[0] * quotaPerRep[0];
    const costPerDollar = totalCost / totalCapacity;
    const roi = totalCapacity / totalCost;
    return { totalCost, totalCapacity, costPerDollar, roi };
  }, [headcount, avgOTE, quotaPerRep]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Headcount</label>
            <span className="text-[10px] font-bold">{headcount[0]}</span>
          </div>
          <Slider value={headcount} onValueChange={setHeadcount} min={1} max={50} step={1} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Avg OTE</label>
            <span className="text-[10px] font-bold">${(avgOTE[0] / 1000).toFixed(0)}k</span>
          </div>
          <Slider value={avgOTE} onValueChange={setAvgOTE} min={80000} max={400000} step={10000} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Quota/Rep</label>
            <span className="text-[10px] font-bold">${(quotaPerRep[0] / 1000).toFixed(0)}k</span>
          </div>
          <Slider value={quotaPerRep} onValueChange={setQuotaPerRep} min={100000} max={1000000} step={50000} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Team Cost", value: `$${(calc.totalCost / 1000000).toFixed(1)}M`, icon: DollarSign, color: "text-foreground" },
          { label: "Revenue Cap.", value: `$${(calc.totalCapacity / 1000000).toFixed(1)}M`, icon: Target, color: "text-primary" },
          { label: "Cost/$ Rev", value: `$${calc.costPerDollar.toFixed(2)}`, icon: Calculator, color: "text-[#F59E0B]" },
          { label: "ROI", value: `${calc.roi.toFixed(1)}x`, icon: TrendingUp, color: "text-[#7C5CFC]" },
        ].map((c) => (
          <div key={c.label} className="rounded border border-border/30 p-2 text-center">
            <c.icon className={`h-3 w-3 mx-auto ${c.color} mb-1`} />
            <p className="text-[8px] text-muted-foreground">{c.label}</p>
            <p className={`text-xs font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Team viz */}
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: headcount[0] }, (_, i) => (
          <div
            key={i}
            className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-[8px] font-bold text-primary"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ROICalculator() {
  const [toolCost, setToolCost] = useState([24000]);
  const [timeSaved, setTimeSaved] = useState([15]);
  const [errorReduction, setErrorReduction] = useState([85]);

  const calc = useMemo(() => {
    const hourlyRate = 75;
    const weeksPerYear = 50;
    const timeSavingsValue = timeSaved[0] * hourlyRate * weeksPerYear;
    const errorSavings = (errorReduction[0] / 100) * 50000;
    const totalSavings = timeSavingsValue + errorSavings;
    const roi = ((totalSavings - toolCost[0]) / toolCost[0]) * 100;
    const paybackMonths = (toolCost[0] / (totalSavings / 12));
    return { timeSavingsValue, errorSavings, totalSavings, roi, paybackMonths };
  }, [toolCost, timeSaved, errorReduction]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Annual Cost</label>
            <span className="text-[10px] font-bold">${(toolCost[0] / 1000).toFixed(0)}k</span>
          </div>
          <Slider value={toolCost} onValueChange={setToolCost} min={5000} max={100000} step={1000} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Hrs Saved/Wk</label>
            <span className="text-[10px] font-bold">{timeSaved[0]}h</span>
          </div>
          <Slider value={timeSaved} onValueChange={setTimeSaved} min={1} max={40} step={1} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Error Reduction</label>
            <span className="text-[10px] font-bold">{errorReduction[0]}%</span>
          </div>
          <Slider value={errorReduction} onValueChange={setErrorReduction} min={10} max={100} step={5} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded border border-primary/20 bg-primary/5 p-3 text-center">
          <ArrowUpRight className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-[9px] text-muted-foreground">Annual ROI</p>
          <p className="text-xl font-bold text-primary">{calc.roi.toFixed(0)}%</p>
        </div>
        <div className="rounded border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-3 text-center">
          <Clock className="h-4 w-4 text-[#F59E0B] mx-auto mb-1" />
          <p className="text-[9px] text-muted-foreground">Payback Period</p>
          <p className="text-xl font-bold text-[#F59E0B]">{calc.paybackMonths.toFixed(1)} mo</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {[
          { label: "Time savings", value: calc.timeSavingsValue, color: "bg-primary" },
          { label: "Error reduction", value: calc.errorSavings, color: "bg-[#7C5CFC]" },
          { label: "Tool cost", value: -toolCost[0], color: "bg-destructive" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground w-24">{item.label}</span>
            <div className="flex-1 h-3 rounded bg-muted/30 overflow-hidden">
              <div
                className={`h-full rounded ${item.color}`}
                style={{ width: `${(Math.abs(item.value) / calc.totalSavings) * 100}%` }}
              />
            </div>
            <span className={`text-[10px] font-bold w-16 text-right ${item.value < 0 ? "text-destructive" : ""}`}>
              {item.value < 0 ? "-" : ""}${(Math.abs(item.value) / 1000).toFixed(0)}k
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComplianceChecklist() {
  const [items, setItems] = useState([
    { id: "c1", category: "Compensation", text: "Commission rates within industry benchmarks", status: "pass" },
    { id: "c2", category: "Compensation", text: "Clawback policy documented and signed", status: "pass" },
    { id: "c3", category: "Compensation", text: "Draw repayment terms clearly stated", status: "warning" },
    { id: "c4", category: "Tax", text: "W-2 vs 1099 classification verified", status: "pass" },
    { id: "c5", category: "Tax", text: "State nexus requirements reviewed", status: "fail" },
    { id: "c6", category: "Tax", text: "Supplemental wage tax rate applied", status: "pass" },
    { id: "c7", category: "Legal", text: "Non-compete clauses reviewed", status: "pass" },
    { id: "c8", category: "Legal", text: "Commission agreement signed by all reps", status: "warning" },
    { id: "c9", category: "Audit", text: "Monthly reconciliation completed", status: "pass" },
    { id: "c10", category: "Audit", text: "Historical data backed up", status: "pass" },
  ]);

  const statusIcons: Record<string, { icon: typeof CheckCircle; color: string }> = {
    pass: { icon: CheckCircle, color: "text-primary" },
    warning: { icon: AlertTriangle, color: "text-[#F59E0B]" },
    fail: { icon: Circle, color: "text-destructive" },
  };

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const order = ["fail", "warning", "pass"];
        const next = order[(order.indexOf(item.status) + 1) % 3];
        return { ...item, status: next };
      })
    );
  };

  const passCount = items.filter((i) => i.status === "pass").length;
  const score = Math.round((passCount / items.length) * 100);

  return (
    <div className="space-y-4">
      {/* Score */}
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15" fill="none"
              stroke="currentColor"
              className={score >= 80 ? "text-primary" : score >= 60 ? "text-[#F59E0B]" : "text-destructive"}
              strokeWidth="3"
              strokeDasharray={`${(score / 100) * 94.2} 94.2`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{score}%</span>
        </div>
        <div>
          <p className="text-xs font-semibold">Compliance Score</p>
          <p className="text-[10px] text-muted-foreground">{passCount}/{items.length} items passing</p>
        </div>
      </div>

      <div className="space-y-1">
        {items.map((item) => {
          const { icon: Icon, color } = statusIcons[item.status];
          return (
            <div
              key={item.id}
              onClick={() => toggleStatus(item.id)}
              className="flex items-center gap-2.5 rounded p-2 cursor-pointer hover:bg-muted/20 transition-colors"
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
              <span className="text-[9px] text-muted-foreground w-20 shrink-0">{item.category}</span>
              <span className="text-[10px] flex-1">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function QuotaPlanner() {
  const [annualTarget, setAnnualTarget] = useState([4800000]);
  const [seasonality, setSeasonality] = useState(true);

  const seasonalWeights = [0.06, 0.07, 0.08, 0.08, 0.09, 0.09, 0.07, 0.08, 0.1, 0.09, 0.1, 0.09];
  const flatWeight = 1 / 12;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const quotas = months.map((m, i) => ({
    month: m,
    quota: annualTarget[0] * (seasonality ? seasonalWeights[i] : flatWeight),
  }));

  const maxQuota = Math.max(...quotas.map((q) => q.quota));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Annual Target</label>
            <span className="text-[10px] font-bold">${(annualTarget[0] / 1000000).toFixed(1)}M</span>
          </div>
          <Slider value={annualTarget} onValueChange={setAnnualTarget} min={1000000} max={20000000} step={500000} />
        </div>
        <button
          onClick={() => setSeasonality(!seasonality)}
          className={`rounded px-3 py-1.5 text-[10px] font-semibold transition-colors ${
            seasonality ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted/50 text-muted-foreground"
          }`}
        >
          {seasonality ? "Seasonal" : "Flat"}
        </button>
      </div>

      <div className="flex items-end gap-1 h-28">
        {quotas.map((q) => {
          const barH = (q.quota / maxQuota) * 100;
          return (
            <div key={q.month} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t-sm bg-primary/70 transition-all"
                style={{ height: `${barH}%` }}
              />
              <span className="text-[7px] text-muted-foreground mt-1">{q.month}</span>
              <span className="text-[7px] font-bold">${(q.quota / 1000).toFixed(0)}k</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Q1", value: quotas.slice(0, 3).reduce((s, q) => s + q.quota, 0) },
          { label: "Q2", value: quotas.slice(3, 6).reduce((s, q) => s + q.quota, 0) },
          { label: "Q3", value: quotas.slice(6, 9).reduce((s, q) => s + q.quota, 0) },
          { label: "Q4", value: quotas.slice(9, 12).reduce((s, q) => s + q.quota, 0) },
        ].map((q) => (
          <div key={q.label} className="rounded border border-border/30 p-2 text-center">
            <p className="text-[9px] text-muted-foreground">{q.label}</p>
            <p className="text-xs font-bold">${(q.value / 1000000).toFixed(2)}M</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RevenueForecast() {
  const actual = [320, 380, 410, 450, 520, 480];
  const forecast = [null, null, null, null, null, null, 510, 540, 590, 620, 680, 720];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const maxVal = 750;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-[10px]">
        <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-sm bg-primary" /> Actual</span>
        <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-sm bg-primary/30 border border-primary/40 border-dashed" /> Forecast</span>
      </div>

      <div className="flex items-end gap-1 h-32">
        {months.map((m, i) => {
          const actualVal = actual[i];
          const forecastVal = forecast[i];
          const barH = actualVal ? (actualVal / maxVal) * 100 : 0;
          const fBarH = forecastVal ? (forecastVal / maxVal) * 100 : 0;
          return (
            <div key={m} className="flex-1 flex flex-col items-center">
              {forecastVal ? (
                <div
                  className="w-full rounded-t-sm bg-primary/20 border border-dashed border-primary/40 transition-all"
                  style={{ height: `${fBarH}%` }}
                />
              ) : (
                <div
                  className="w-full rounded-t-sm bg-primary transition-all"
                  style={{ height: `${barH}%` }}
                />
              )}
              <span className="text-[7px] text-muted-foreground mt-1">{m}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded border border-border/30 p-2 text-center">
          <p className="text-[9px] text-muted-foreground">YTD Actual</p>
          <p className="text-sm font-bold text-primary">${(actual.reduce((s, v) => s + v, 0) / 1000).toFixed(0)}k</p>
        </div>
        <div className="rounded border border-border/30 p-2 text-center">
          <p className="text-[9px] text-muted-foreground">H2 Forecast</p>
          <p className="text-sm font-bold text-[#7C5CFC]">$3.66M</p>
        </div>
        <div className="rounded border border-border/30 p-2 text-center">
          <p className="text-[9px] text-muted-foreground">Annual Proj.</p>
          <p className="text-sm font-bold">$6.22M</p>
        </div>
      </div>
    </div>
  );
}

export function ExpenseTracker() {
  const categories = [
    { name: "Base Salary", amount: 1800000, budget: 2000000, color: "bg-primary" },
    { name: "Commissions", amount: 420000, budget: 500000, color: "bg-[#7C5CFC]" },
    { name: "SPIFs & Bonuses", amount: 85000, budget: 100000, color: "bg-[#F59E0B]" },
    { name: "Travel", amount: 62000, budget: 80000, color: "bg-muted-foreground" },
    { name: "Tools & Software", amount: 48000, budget: 50000, color: "bg-primary/60" },
    { name: "Training", amount: 28000, budget: 40000, color: "bg-[#7C5CFC]/60" },
  ];

  const totalSpent = categories.reduce((s, c) => s + c.amount, 0);
  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold">Sales Org Budget</p>
          <p className="text-[10px] text-muted-foreground">
            ${(totalSpent / 1000000).toFixed(2)}M of ${(totalBudget / 1000000).toFixed(2)}M used
          </p>
        </div>
        <span className={`text-xs font-bold ${totalSpent / totalBudget > 0.9 ? "text-[#F59E0B]" : "text-primary"}`}>
          {((totalSpent / totalBudget) * 100).toFixed(0)}%
        </span>
      </div>

      {/* Overall bar */}
      <div className="h-3 rounded-full bg-muted/30 overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(totalSpent / totalBudget) * 100}%` }} />
      </div>

      <div className="space-y-2">
        {categories.map((c) => {
          const pct = (c.amount / c.budget) * 100;
          return (
            <div key={c.name} className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-28 shrink-0">{c.name}</span>
              <div className="flex-1 h-2.5 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className={`h-full rounded-full ${c.color} transition-all`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <span className="text-[9px] font-semibold w-10 text-right">{pct.toFixed(0)}%</span>
              <span className="text-[9px] text-muted-foreground w-14 text-right">${(c.amount / 1000).toFixed(0)}k</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function YTDEarnings() {
  const earnings = [
    { month: "Jan", base: 12500, commission: 4200, bonus: 0 },
    { month: "Feb", base: 12500, commission: 6800, bonus: 2000 },
    { month: "Mar", base: 12500, commission: 8100, bonus: 0 },
    { month: "Apr", base: 12500, commission: 5500, bonus: 0 },
    { month: "May", base: 12500, commission: 9200, bonus: 5000 },
    { month: "Jun", base: 12500, commission: 7600, bonus: 0 },
  ];

  let cumulative = 0;
  const data = earnings.map((e) => {
    const total = e.base + e.commission + e.bonus;
    cumulative += total;
    return { ...e, total, cumulative };
  });

  const maxCumulative = data[data.length - 1].cumulative;
  const oteTarget = 250000;

  return (
    <div className="space-y-4">
      {/* Cumulative bars */}
      <div className="flex items-end gap-1 h-24">
        {data.map((d) => {
          const baseH = (d.base / d.total) * 100;
          const commH = (d.commission / d.total) * 100;
          const bonusH = (d.bonus / d.total) * 100;
          const totalH = (d.cumulative / oteTarget) * 100;
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center">
              <div className="w-full rounded-t-sm overflow-hidden flex flex-col" style={{ height: `${Math.min(totalH, 100)}%` }}>
                {d.bonus > 0 && <div className="bg-[#F59E0B]" style={{ height: `${bonusH}%` }} />}
                <div className="bg-primary flex-1" style={{ height: `${commH}%` }} />
                <div className="bg-muted-foreground/40" style={{ height: `${baseH}%` }} />
              </div>
              <span className="text-[7px] text-muted-foreground mt-1">{d.month}</span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 text-[9px]">
        <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-sm bg-muted-foreground/40" /> Base</span>
        <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-sm bg-primary" /> Commission</span>
        <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-sm bg-[#F59E0B]" /> Bonus</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="rounded border border-border/30 p-2 text-center">
          <p className="text-[8px] text-muted-foreground">YTD Base</p>
          <p className="text-xs font-bold">${(data.reduce((s, d) => s + d.base, 0) / 1000).toFixed(0)}k</p>
        </div>
        <div className="rounded border border-border/30 p-2 text-center">
          <p className="text-[8px] text-muted-foreground">YTD Comm</p>
          <p className="text-xs font-bold text-primary">${(data.reduce((s, d) => s + d.commission, 0) / 1000).toFixed(0)}k</p>
        </div>
        <div className="rounded border border-border/30 p-2 text-center">
          <p className="text-[8px] text-muted-foreground">YTD Bonus</p>
          <p className="text-xs font-bold text-[#F59E0B]">${(data.reduce((s, d) => s + d.bonus, 0) / 1000).toFixed(0)}k</p>
        </div>
        <div className="rounded border border-primary/20 bg-primary/5 p-2 text-center">
          <p className="text-[8px] text-muted-foreground">YTD Total</p>
          <p className="text-xs font-bold text-primary">${(cumulative / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* OTE progress */}
      <div>
        <div className="flex justify-between text-[9px] mb-1">
          <span className="text-muted-foreground">OTE Progress</span>
          <span className="font-semibold">{((cumulative / oteTarget) * 100).toFixed(0)}% of ${(oteTarget / 1000).toFixed(0)}k</span>
        </div>
        <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: `${(cumulative / oteTarget) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
