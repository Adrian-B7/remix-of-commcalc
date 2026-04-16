import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { DollarSign, Building2, Landmark, Shield, Calculator } from "lucide-react";

const stateTaxRates: Record<string, { name: string; rate: number }> = {
  CA: { name: "California", rate: 13.3 },
  NY: { name: "New York", rate: 10.9 },
  TX: { name: "Texas", rate: 0 },
  FL: { name: "Florida", rate: 0 },
  WA: { name: "Washington", rate: 0 },
  NJ: { name: "New Jersey", rate: 10.75 },
  IL: { name: "Illinois", rate: 4.95 },
  MA: { name: "Massachusetts", rate: 5.0 },
  CO: { name: "Colorado", rate: 4.4 },
  GA: { name: "Georgia", rate: 5.49 },
  PA: { name: "Pennsylvania", rate: 3.07 },
  OH: { name: "Ohio", rate: 3.99 },
};

const federalBrackets = [
  { min: 0, max: 11000, rate: 10 },
  { min: 11001, max: 44725, rate: 12 },
  { min: 44726, max: 95375, rate: 22 },
  { min: 95376, max: 182100, rate: 24 },
  { min: 182101, max: 231250, rate: 32 },
  { min: 231251, max: 578125, rate: 35 },
  { min: 578126, max: Infinity, rate: 37 },
];

function calcFederalTax(income: number) {
  let tax = 0;
  for (const bracket of federalBrackets) {
    if (income <= 0) break;
    const taxable = Math.min(income, bracket.max - bracket.min + 1);
    tax += taxable * (bracket.rate / 100);
    income -= taxable;
  }
  return tax;
}

export function TaxEstimator() {
  const [grossIncome, setGrossIncome] = useState([185000]);
  const [commissionIncome, setCommissionIncome] = useState([65000]);
  const [selectedState, setSelectedState] = useState("CA");

  const calc = useMemo(() => {
    const total = grossIncome[0] + commissionIncome[0];
    const federal = calcFederalTax(total);
    const stateRate = stateTaxRates[selectedState].rate;
    const stateTax = total * (stateRate / 100);
    const socialSecurity = Math.min(total, 168600) * 0.062;
    const medicare = total * 0.0145 + (total > 200000 ? (total - 200000) * 0.009 : 0);
    const fica = socialSecurity + medicare;
    const totalTax = federal + stateTax + fica;
    const effectiveRate = (totalTax / total) * 100;
    const takeHome = total - totalTax;

    return { total, federal, stateTax, fica, socialSecurity, medicare, totalTax, effectiveRate, takeHome };
  }, [grossIncome, commissionIncome, selectedState]);

  const taxSegments = [
    { label: "Federal", amount: calc.federal, color: "bg-[#7C5CFC]", pct: (calc.federal / calc.total) * 100 },
    { label: "State", amount: calc.stateTax, color: "bg-[#F59E0B]", pct: (calc.stateTax / calc.total) * 100 },
    { label: "FICA", amount: calc.fica, color: "bg-primary", pct: (calc.fica / calc.total) * 100 },
    { label: "Take-home", amount: calc.takeHome, color: "bg-success", pct: (calc.takeHome / calc.total) * 100 },
  ];

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1 text-xs font-semibold">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Base Salary
            </label>
            <span className="text-xs font-bold">${grossIncome[0].toLocaleString()}</span>
          </div>
          <Slider value={grossIncome} onValueChange={setGrossIncome} min={30000} max={400000} step={5000} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1 text-xs font-semibold">
              <DollarSign className="h-3.5 w-3.5 text-primary" /> Commission
            </label>
            <span className="text-xs font-bold text-primary">${commissionIncome[0].toLocaleString()}</span>
          </div>
          <Slider value={commissionIncome} onValueChange={setCommissionIncome} min={0} max={500000} step={5000} />
        </div>
        <div>
          <label className="flex items-center gap-1 text-xs font-semibold mb-2">
            <Landmark className="h-3.5 w-3.5 text-[#F59E0B]" /> State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full rounded border border-input bg-background px-2 py-1.5 text-xs"
          >
            {Object.entries(stateTaxRates).map(([code, { name, rate }]) => (
              <option key={code} value={code}>
                {name} ({rate}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stacked bar */}
      <div>
        <div className="flex items-center gap-1 text-xs font-semibold mb-2">
          <Calculator className="h-3.5 w-3.5" /> Income Breakdown
        </div>
        <div className="h-6 rounded flex overflow-hidden">
          {taxSegments.map((s) => (
            <div
              key={s.label}
              className={`${s.color} relative group`}
              style={{ width: `${s.pct}%` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {s.pct > 8 && (
                  <span className="text-[8px] font-bold text-white drop-shadow-sm">{s.pct.toFixed(0)}%</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          {taxSegments.map((s) => (
            <span key={s.label} className="flex items-center gap-1 text-[10px]">
              <div className={`h-2 w-2 rounded-sm ${s.color}`} />
              {s.label}: ${s.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          ))}
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: "Total Income", value: calc.total, icon: DollarSign, color: "text-foreground" },
          { label: "Effective Rate", value: `${calc.effectiveRate.toFixed(1)}%`, icon: Calculator, color: "text-[#7C5CFC]" },
          { label: "Total Tax", value: calc.totalTax, icon: Shield, color: "text-destructive" },
          { label: "Take-home", value: calc.takeHome, icon: DollarSign, color: "text-primary" },
        ].map((c) => (
          <div key={c.label} className="rounded border border-border/30 bg-card p-2.5 text-center">
            <c.icon className={`h-3.5 w-3.5 mx-auto ${c.color} mb-1`} />
            <p className="text-[9px] text-muted-foreground">{c.label}</p>
            <p className={`text-sm font-bold ${c.color}`}>
              {typeof c.value === "number" ? `$${c.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Federal brackets */}
      <div>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Federal Tax Brackets</span>
        <div className="mt-1.5 flex gap-1">
          {federalBrackets.slice(0, 6).map((b) => {
            const isActive = calc.total > b.min;
            return (
              <div
                key={b.rate}
                className={`flex-1 rounded border p-1.5 text-center transition-all ${
                  isActive ? "border-[#7C5CFC]/40 bg-[#7C5CFC]/5" : "border-border/20 opacity-40"
                }`}
              >
                <p className="text-[9px] font-bold text-[#7C5CFC]">{b.rate}%</p>
                <p className="text-[7px] text-muted-foreground">
                  {b.max === Infinity ? `$${(b.min / 1000).toFixed(0)}k+` : `$${(b.min / 1000).toFixed(0)}k`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
