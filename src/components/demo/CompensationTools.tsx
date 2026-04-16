import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import {
  DollarSign, Users, Percent, ArrowRight, RotateCcw, Zap,
  UserPlus, Calendar, Shield, AlertTriangle,
  DndContext, SortableContext,
} from "lucide-react";
import {
  DndContext as DndContextCore,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext as SortableContextCore,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SplitCommissionCalc() {
  const [dealSize, setDealSize] = useState([120000]);
  const [splits, setSplits] = useState([
    { id: "s1", rep: "Sarah Kim", pct: 50, role: "Closer" },
    { id: "s2", rep: "Mike Torres", pct: 30, role: "Sourcer" },
    { id: "s3", rep: "Priya Rao", pct: 20, role: "Support" },
  ]);

  const commRate = 10;
  const totalComm = dealSize[0] * (commRate / 100);

  const updateSplit = (id: string, pct: number) => {
    setSplits((prev) => prev.map((s) => (s.id === id ? { ...s, pct } : s)));
  };

  const totalPct = splits.reduce((s, sp) => s + sp.pct, 0);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-xs font-semibold">Deal Size</label>
          <span className="text-xs font-bold text-primary">${dealSize[0].toLocaleString()}</span>
        </div>
        <Slider value={dealSize} onValueChange={setDealSize} min={10000} max={500000} step={5000} />
      </div>

      <div className="rounded border border-border/30 divide-y divide-border/20">
        {splits.map((sp) => (
          <div key={sp.id} className="flex items-center gap-3 p-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
              {sp.rep.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold">{sp.rep}</p>
              <p className="text-[9px] text-muted-foreground">{sp.role}</p>
            </div>
            <div className="w-20">
              <Slider
                value={[sp.pct]}
                onValueChange={([v]) => updateSplit(sp.id, v)}
                min={0}
                max={100}
                step={5}
              />
            </div>
            <span className="text-xs font-bold w-10 text-right">{sp.pct}%</span>
            <span className="text-xs font-semibold text-primary w-16 text-right">
              ${((totalComm * sp.pct) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        ))}
      </div>

      {totalPct !== 100 && (
        <div className="rounded border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-2 flex items-center gap-2 text-[10px]">
          <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B]" />
          <span>Splits total {totalPct}% — should equal 100%</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs font-mono rounded bg-muted/30 p-2.5">
        <span>${dealSize[0].toLocaleString()}</span>
        <span className="text-muted-foreground">×</span>
        <span className="text-primary font-bold">{commRate}%</span>
        <span className="text-muted-foreground">=</span>
        <span className="font-bold">${totalComm.toLocaleString()}</span>
        <span className="text-muted-foreground ml-auto">split across {splits.length} reps</span>
      </div>
    </div>
  );
}

export function ClawbackCalculator() {
  const [dealSize, setDealSize] = useState([85000]);
  const [monthsPaid, setMonthsPaid] = useState([4]);
  const [contractLength, setContractLength] = useState([12]);

  const calc = useMemo(() => {
    const commission = dealSize[0] * 0.1;
    const prorated = commission * (monthsPaid[0] / contractLength[0]);
    const clawback = commission - prorated;
    const pctClawback = ((contractLength[0] - monthsPaid[0]) / contractLength[0]) * 100;
    return { commission, prorated, clawback, pctClawback };
  }, [dealSize, monthsPaid, contractLength]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Deal Size</label>
            <span className="text-[10px] font-bold">${(dealSize[0] / 1000).toFixed(0)}k</span>
          </div>
          <Slider value={dealSize} onValueChange={setDealSize} min={10000} max={300000} step={5000} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Months Paid</label>
            <span className="text-[10px] font-bold">{monthsPaid[0]}</span>
          </div>
          <Slider value={monthsPaid} onValueChange={setMonthsPaid} min={1} max={contractLength[0]} step={1} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Contract (mo)</label>
            <span className="text-[10px] font-bold">{contractLength[0]}</span>
          </div>
          <Slider value={contractLength} onValueChange={setContractLength} min={3} max={36} step={3} />
        </div>
      </div>

      {/* Visual timeline */}
      <div>
        <div className="flex gap-0.5">
          {Array.from({ length: contractLength[0] }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-5 rounded-sm ${
                i < monthsPaid[0] ? "bg-primary" : "bg-destructive/30"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[8px] text-muted-foreground">
          <span>Month 1</span>
          <span>Month {contractLength[0]}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded border border-border/30 p-2 text-center">
          <p className="text-[9px] text-muted-foreground">Original Comm</p>
          <p className="text-sm font-bold">${calc.commission.toLocaleString()}</p>
        </div>
        <div className="rounded border border-primary/20 bg-primary/5 p-2 text-center">
          <p className="text-[9px] text-muted-foreground">Earned</p>
          <p className="text-sm font-bold text-primary">${calc.prorated.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="rounded border border-destructive/20 bg-destructive/5 p-2 text-center">
          <RotateCcw className="h-3 w-3 text-destructive mx-auto mb-0.5" />
          <p className="text-[9px] text-muted-foreground">Clawback</p>
          <p className="text-sm font-bold text-destructive">${calc.clawback.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>
    </div>
  );
}

type Spif = { id: string; name: string; type: string; target: number; bonus: number; active: boolean };

export function SpifBuilder() {
  const [spifs, setSpifs] = useState<Spif[]>([
    { id: "sp1", name: "Q2 Blitz", type: "Deal count", target: 5, bonus: 2500, active: true },
    { id: "sp2", name: "Enterprise Push", type: "Revenue", target: 100000, bonus: 5000, active: true },
    { id: "sp3", name: "New Logo", type: "New customers", target: 3, bonus: 1500, active: false },
  ]);

  const toggleSpif = (id: string) => {
    setSpifs((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const addSpif = () => {
    setSpifs((prev) => [
      ...prev,
      {
        id: `sp${Date.now()}`,
        name: `SPIF ${prev.length + 1}`,
        type: "Deal count",
        target: 5,
        bonus: 1000,
        active: true,
      },
    ]);
  };

  const totalBudget = spifs.filter((s) => s.active).reduce((sum, s) => sum + s.bonus, 0);

  return (
    <div className="space-y-3">
      {spifs.map((spif) => (
        <div
          key={spif.id}
          className={`rounded border p-3 transition-all ${
            spif.active ? "border-primary/30 bg-primary/5" : "border-border/20 opacity-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className={`h-3.5 w-3.5 ${spif.active ? "text-[#F59E0B]" : "text-muted-foreground"}`} />
              <span className="text-xs font-semibold">{spif.name}</span>
            </div>
            <button
              onClick={() => toggleSpif(spif.id)}
              className={`rounded px-2 py-0.5 text-[9px] font-semibold ${
                spif.active
                  ? "bg-primary/10 text-primary"
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {spif.active ? "Active" : "Inactive"}
            </button>
          </div>
          <div className="mt-2 flex gap-4 text-[10px]">
            <span className="text-muted-foreground">Type: <b className="text-foreground">{spif.type}</b></span>
            <span className="text-muted-foreground">Target: <b className="text-foreground">{spif.type === "Revenue" ? `$${(spif.target / 1000).toFixed(0)}k` : spif.target}</b></span>
            <span className="text-muted-foreground">Bonus: <b className="text-primary">${spif.bonus.toLocaleString()}</b></span>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addSpif} className="w-full gap-1.5 text-xs">
        <Plus className="h-3.5 w-3.5" /> Add SPIF
      </Button>
      <div className="rounded bg-muted/30 p-2 text-center text-xs">
        Active budget: <b className="text-primary">${totalBudget.toLocaleString()}</b> across {spifs.filter((s) => s.active).length} SPIFs
      </div>
    </div>
  );
}

export function RampSchedule() {
  const months = [
    { month: 1, quotaPct: 25, drawPct: 100, expected: "Onboarding + training" },
    { month: 2, quotaPct: 50, drawPct: 75, expected: "Shadow selling + first demos" },
    { month: 3, quotaPct: 75, drawPct: 50, expected: "Solo demos + first proposals" },
    { month: 4, quotaPct: 100, drawPct: 25, expected: "Full quota assignment" },
    { month: 5, quotaPct: 100, drawPct: 0, expected: "Independent contributor" },
    { month: 6, quotaPct: 100, drawPct: 0, expected: "Full performance" },
  ];

  const baseQuota = 75000;
  const baseSalary = 6250;

  return (
    <div className="space-y-3">
      <div className="rounded border border-border/30 divide-y divide-border/20">
        <div className="grid grid-cols-6 gap-1 p-2 text-[8px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Month</span>
          <span>Quota %</span>
          <span>Target</span>
          <span>Draw</span>
          <span>Guarantee</span>
          <span>Milestone</span>
        </div>
        {months.map((m) => (
          <div key={m.month} className="grid grid-cols-6 gap-1 p-2 items-center">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground/50" />
              <span className="text-[10px] font-semibold">M{m.month}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex-1 h-1.5 rounded-full bg-muted/30">
                <div className="h-full rounded-full bg-primary" style={{ width: `${m.quotaPct}%` }} />
              </div>
              <span className="text-[9px] font-bold">{m.quotaPct}%</span>
            </div>
            <span className="text-[10px] font-mono">${((baseQuota * m.quotaPct) / 100 / 1000).toFixed(0)}k</span>
            <span className={`text-[10px] font-mono ${m.drawPct > 0 ? "text-[#F59E0B]" : "text-muted-foreground"}`}>
              {m.drawPct > 0 ? `${m.drawPct}%` : "—"}
            </span>
            <span className="text-[10px] font-mono">
              ${((baseSalary * m.drawPct) / 100).toLocaleString()}
            </span>
            <span className="text-[8px] text-muted-foreground truncate">{m.expected}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
        <UserPlus className="h-3 w-3" />
        Draw decreases as quota ramps up — guaranteed compensation during onboarding
      </div>
    </div>
  );
}

export function ManagerOverrideCalc() {
  const [overrideRate, setOverrideRate] = useState([3]);
  const teamRevenue = [
    { rep: "Sarah Kim", revenue: 284500 },
    { rep: "Mike Torres", revenue: 198000 },
    { rep: "Priya Rao", revenue: 176300 },
    { rep: "James Chen", revenue: 152000 },
    { rep: "Lina Vasquez", revenue: 134800 },
  ];

  const totalRevenue = teamRevenue.reduce((s, r) => s + r.revenue, 0);
  const override = totalRevenue * (overrideRate[0] / 100);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-xs font-semibold">Override Rate</label>
          <span className="text-xs font-bold text-[#7C5CFC]">{overrideRate[0]}%</span>
        </div>
        <Slider value={overrideRate} onValueChange={setOverrideRate} min={1} max={10} step={0.5} />
      </div>

      <div className="rounded border border-border/30 divide-y divide-border/20">
        {teamRevenue.map((r) => {
          const repOverride = r.revenue * (overrideRate[0] / 100);
          return (
            <div key={r.rep} className="flex items-center justify-between p-2.5">
              <span className="text-[10px] font-semibold">{r.rep}</span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-muted-foreground">${(r.revenue / 1000).toFixed(0)}k rev</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground/30" />
                <span className="font-bold text-[#7C5CFC]">${repOverride.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 p-3 text-center">
        <p className="text-[9px] text-muted-foreground">Total Manager Override</p>
        <p className="text-xl font-bold text-[#7C5CFC]">${override.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        <p className="text-[9px] text-muted-foreground mt-0.5">{overrideRate[0]}% of ${(totalRevenue / 1000).toFixed(0)}k team revenue</p>
      </div>
    </div>
  );
}
