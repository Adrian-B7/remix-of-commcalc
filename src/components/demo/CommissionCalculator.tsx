import { useState, useMemo } from "react";
import { DollarSign, Percent, Calculator, ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const tiers = [
  { name: "Starter", min: 0, max: 25000, rate: 5, color: "bg-muted-foreground" },
  { name: "Growth", min: 25001, max: 75000, rate: 8, color: "bg-[#F59E0B]" },
  { name: "Pro", min: 75001, max: 150000, rate: 12, color: "bg-[#7C5CFC]" },
  { name: "Elite", min: 150001, max: 500000, rate: 18, color: "bg-primary" },
];

const quotaMultipliers = [
  { label: "Below quota", range: "0–80%", multiplier: 0.8 },
  { label: "At quota", range: "80–100%", multiplier: 1.0 },
  { label: "Above quota", range: "100–120%", multiplier: 1.25 },
  { label: "Accelerator", range: "120%+", multiplier: 1.5 },
];

export function CommissionCalculator() {
  const [dealSize, setDealSize] = useState([75000]);
  const [attainment, setAttainment] = useState([95]);

  const calculation = useMemo(() => {
    const deal = dealSize[0];
    const att = attainment[0];

    const tier = tiers.find((t) => deal >= t.min && deal <= t.max) ?? tiers[tiers.length - 1];
    const qm = att < 80 ? 0.8 : att <= 100 ? 1.0 : att <= 120 ? 1.25 : 1.5;
    const activeQm = quotaMultipliers.find((q) =>
      att < 80 ? q.multiplier === 0.8 : att <= 100 ? q.multiplier === 1.0 : att <= 120 ? q.multiplier === 1.25 : q.multiplier === 1.5
    );
    const commission = deal * (tier.rate / 100) * qm;

    return { tier, qm, activeQm, commission };
  }, [dealSize, attainment]);

  return (
    <div className="space-y-6">
      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-1.5 text-xs font-semibold">
              <DollarSign className="h-3.5 w-3.5 text-primary" />
              Deal Size
            </label>
            <span className="text-sm font-bold text-primary">${dealSize[0].toLocaleString()}</span>
          </div>
          <Slider
            value={dealSize}
            onValueChange={setDealSize}
            min={5000}
            max={500000}
            step={5000}
            className="w-full"
          />
          <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
            <span>$5k</span>
            <span>$500k</span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-1.5 text-xs font-semibold">
              <Percent className="h-3.5 w-3.5 text-[#7C5CFC]" />
              Quota Attainment
            </label>
            <span className="text-sm font-bold text-[#7C5CFC]">{attainment[0]}%</span>
          </div>
          <Slider
            value={attainment}
            onValueChange={setAttainment}
            min={0}
            max={200}
            step={5}
            className="w-full"
          />
          <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
            <span>0%</span>
            <span>200%</span>
          </div>
        </div>
      </div>

      {/* Calculation breakdown */}
      <div className="rounded-lg border border-border/40 bg-muted/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold">Calculation Breakdown</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="rounded bg-card border border-border/30 px-3 py-1.5 font-mono">
            ${dealSize[0].toLocaleString()}
          </div>
          <span className="text-muted-foreground">×</span>
          <div className={`rounded px-3 py-1.5 font-mono text-white ${calculation.tier.color}`}>
            {calculation.tier.rate}%
            <span className="ml-1 text-[10px] opacity-80">{calculation.tier.name}</span>
          </div>
          <span className="text-muted-foreground">×</span>
          <div className="rounded bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 px-3 py-1.5 font-mono text-[#7C5CFC]">
            {calculation.qm}x
            <span className="ml-1 text-[10px] opacity-80">{calculation.activeQm?.label}</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="rounded bg-primary/10 border border-primary/20 px-4 py-1.5 font-mono text-primary font-bold text-sm">
            ${calculation.commission.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Tier visualization */}
      <div className="grid grid-cols-4 gap-2">
        {tiers.map((t) => {
          const isActive = dealSize[0] >= t.min && dealSize[0] <= t.max;
          return (
            <div
              key={t.name}
              className={`rounded border p-2.5 text-center transition-all ${
                isActive
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/30 bg-card opacity-50"
              }`}
            >
              <div className={`mx-auto h-1.5 w-8 rounded-full ${t.color} mb-2`} />
              <p className="text-[10px] font-semibold">{t.name}</p>
              <p className="text-lg font-bold">{t.rate}%</p>
              <p className="text-[9px] text-muted-foreground">
                ${(t.min / 1000).toFixed(0)}k–${(t.max / 1000).toFixed(0)}k
              </p>
            </div>
          );
        })}
      </div>

      {/* Quota multiplier row */}
      <div className="grid grid-cols-4 gap-2">
        {quotaMultipliers.map((q) => {
          const isActive = calculation.qm === q.multiplier;
          return (
            <div
              key={q.label}
              className={`rounded border p-2 text-center transition-all ${
                isActive
                  ? "border-[#7C5CFC] bg-[#7C5CFC]/5 shadow-sm"
                  : "border-border/30 bg-card opacity-50"
              }`}
            >
              <p className="text-[10px] font-semibold">{q.label}</p>
              <p className="text-sm font-bold text-[#7C5CFC]">{q.multiplier}x</p>
              <p className="text-[9px] text-muted-foreground">{q.range}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
