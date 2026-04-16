import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { DollarSign, Globe, ArrowRightLeft, TrendingUp, TrendingDown } from "lucide-react";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1.0 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 149.5 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.36 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.53 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 0.88 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.34 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.2 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", rate: 4.97 },
];

export function CurrencyConverter() {
  const [amount, setAmount] = useState([100000]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");

  const result = useMemo(() => {
    const from = currencies.find((c) => c.code === fromCurrency)!;
    const to = currencies.find((c) => c.code === toCurrency)!;
    const inUSD = amount[0] / from.rate;
    const converted = inUSD * to.rate;
    const exchangeRate = to.rate / from.rate;
    return { converted, exchangeRate, from, to };
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
          <label className="text-xs font-semibold mb-1.5 block">From</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full rounded border border-input bg-background px-2 py-1.5 text-xs"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-muted/30">
            <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold mb-1.5 block">To</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full rounded border border-input bg-background px-2 py-1.5 text-xs"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-1 text-xs font-semibold">
            <DollarSign className="h-3.5 w-3.5" /> Amount
          </label>
          <span className="text-sm font-bold">
            {result.from.symbol}{amount[0].toLocaleString()}
          </span>
        </div>
        <Slider value={amount} onValueChange={setAmount} min={1000} max={1000000} step={1000} />
      </div>

      {/* Result */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
        <p className="text-xs text-muted-foreground mb-1">Converted Amount</p>
        <p className="text-2xl font-bold text-primary">
          {result.to.symbol}{result.converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          1 {fromCurrency} = {result.exchangeRate.toFixed(4)} {toCurrency}
        </p>
      </div>

      {/* Quick reference grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {currencies.filter((c) => c.code !== fromCurrency).slice(0, 5).map((c) => {
          const from = currencies.find((x) => x.code === fromCurrency)!;
          const converted = (amount[0] / from.rate) * c.rate;
          return (
            <div key={c.code} className="rounded border border-border/20 bg-card p-2 text-center">
              <p className="text-[9px] font-semibold text-muted-foreground">{c.code}</p>
              <p className="text-[10px] font-bold">{c.symbol}{converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PayoutTimeline() {
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");
  const payouts = [
    { month: "Jan", base: 12500, commission: 4200, bonus: 0, status: "paid" },
    { month: "Feb", base: 12500, commission: 6800, bonus: 2000, status: "paid" },
    { month: "Mar", base: 12500, commission: 8100, bonus: 0, status: "paid" },
    { month: "Apr", base: 12500, commission: 5500, bonus: 0, status: "pending" },
    { month: "May", base: 12500, commission: 9200, bonus: 5000, status: "pending" },
    { month: "Jun", base: 12500, commission: 0, bonus: 0, status: "projected" },
  ];

  const statusColors: Record<string, string> = {
    paid: "bg-primary text-primary-foreground",
    pending: "bg-[#F59E0B] text-white",
    projected: "bg-muted text-muted-foreground",
  };

  const totalPaid = payouts.filter((p) => p.status === "paid").reduce((s, p) => s + p.base + p.commission + p.bonus, 0);
  const totalPending = payouts.filter((p) => p.status === "pending").reduce((s, p) => s + p.base + p.commission + p.bonus, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        {["Q1", "Q2", "Q3", "Q4"].map((q) => (
          <button
            key={q}
            onClick={() => setSelectedQuarter(q)}
            className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
              selectedQuarter === q ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40" />
        <div className="space-y-3">
          {payouts.map((p) => {
            const total = p.base + p.commission + p.bonus;
            return (
              <div key={p.month} className="flex items-start gap-3 ml-1">
                <div className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold ${statusColors[p.status]}`}>
                  {p.month.slice(0, 1)}
                </div>
                <div className="flex-1 rounded border border-border/30 bg-card p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold">{p.month}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${statusColors[p.status]}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="flex gap-3 text-[10px]">
                    <span className="text-muted-foreground">Base: <b className="text-foreground">${p.base.toLocaleString()}</b></span>
                    <span className="text-muted-foreground">Comm: <b className="text-primary">${p.commission.toLocaleString()}</b></span>
                    {p.bonus > 0 && <span className="text-muted-foreground">Bonus: <b className="text-[#F59E0B]">${p.bonus.toLocaleString()}</b></span>}
                    <span className="ml-auto font-bold">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded border border-border/30 bg-primary/5 p-2 text-center">
          <p className="text-[9px] text-muted-foreground">Paid</p>
          <p className="text-sm font-bold text-primary">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded border border-border/30 bg-[#F59E0B]/5 p-2 text-center">
          <p className="text-[9px] text-muted-foreground">Pending</p>
          <p className="text-sm font-bold text-[#F59E0B]">${totalPending.toLocaleString()}</p>
        </div>
        <div className="rounded border border-border/30 bg-muted/30 p-2 text-center">
          <p className="text-[9px] text-muted-foreground">YTD Total</p>
          <p className="text-sm font-bold">${(totalPaid + totalPending).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export function ScenarioModeler() {
  const [baseDeals, setBaseDeals] = useState([8]);
  const [avgDeal, setAvgDeal] = useState([45000]);
  const [closeRate, setCloseRate] = useState([35]);
  const [rampMonths, setRampMonths] = useState([3]);

  const scenarios = useMemo(() => {
    const pipeline = baseDeals[0] * avgDeal[0];
    const closedRev = pipeline * (closeRate[0] / 100);
    const commission = closedRev * 0.1;

    const conservative = { deals: Math.floor(baseDeals[0] * 0.7), rev: closedRev * 0.7, comm: commission * 0.7 };
    const base = { deals: baseDeals[0], rev: closedRev, comm: commission };
    const optimistic = { deals: Math.ceil(baseDeals[0] * 1.4), rev: closedRev * 1.4, comm: commission * 1.4 };

    return { pipeline, conservative, base, optimistic, ramp: rampMonths[0] };
  }, [baseDeals, avgDeal, closeRate, rampMonths]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Monthly Deals</label>
            <span className="text-[10px] font-bold">{baseDeals[0]}</span>
          </div>
          <Slider value={baseDeals} onValueChange={setBaseDeals} min={1} max={30} step={1} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Avg Deal Size</label>
            <span className="text-[10px] font-bold">${avgDeal[0].toLocaleString()}</span>
          </div>
          <Slider value={avgDeal} onValueChange={setAvgDeal} min={5000} max={200000} step={5000} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Close Rate</label>
            <span className="text-[10px] font-bold">{closeRate[0]}%</span>
          </div>
          <Slider value={closeRate} onValueChange={setCloseRate} min={5} max={80} step={5} />
        </div>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-[10px] font-semibold">Ramp (months)</label>
            <span className="text-[10px] font-bold">{rampMonths[0]}</span>
          </div>
          <Slider value={rampMonths} onValueChange={setRampMonths} min={1} max={12} step={1} />
        </div>
      </div>

      {/* Scenario cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Conservative", data: scenarios.conservative, color: "border-muted-foreground/30", icon: TrendingDown, iconColor: "text-muted-foreground" },
          { label: "Base Case", data: scenarios.base, color: "border-primary/30 bg-primary/5", icon: DollarSign, iconColor: "text-primary" },
          { label: "Optimistic", data: scenarios.optimistic, color: "border-[#F59E0B]/30", icon: TrendingUp, iconColor: "text-[#F59E0B]" },
        ].map((s) => (
          <div key={s.label} className={`rounded border ${s.color} p-3 text-center`}>
            <s.icon className={`h-4 w-4 mx-auto mb-1 ${s.iconColor}`} />
            <p className="text-[9px] font-semibold text-muted-foreground">{s.label}</p>
            <p className="text-sm font-bold mt-1">${(s.data.rev / 1000).toFixed(0)}k</p>
            <p className="text-[9px] text-muted-foreground">{s.data.deals} deals/mo</p>
            <div className="mt-1.5 h-1 rounded-full bg-muted/50 overflow-hidden">
              <div
                className={`h-full rounded-full ${s.label === "Base Case" ? "bg-primary" : s.label === "Optimistic" ? "bg-[#F59E0B]" : "bg-muted-foreground"}`}
                style={{ width: `${(s.data.rev / scenarios.optimistic.rev) * 100}%` }}
              />
            </div>
            <p className="text-[10px] font-semibold text-primary mt-1.5">
              ${(s.data.comm / 1000).toFixed(0)}k comm
            </p>
          </div>
        ))}
      </div>

      {/* Ramp visualization */}
      <div>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {scenarios.ramp}-Month Ramp Trajectory
        </span>
        <div className="mt-2 flex items-end gap-1 h-16">
          {Array.from({ length: 12 }, (_, i) => {
            const rampPct = Math.min(1, (i + 1) / scenarios.ramp);
            const rev = scenarios.base.rev * rampPct;
            const barH = (rev / (scenarios.base.rev * 1.1)) * 100;
            const isRamping = i < scenarios.ramp;
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t-sm transition-all ${isRamping ? "bg-[#F59E0B]/60" : "bg-primary"}`}
                  style={{ height: `${barH}%` }}
                />
                <span className="text-[7px] text-muted-foreground mt-0.5">M{i + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
