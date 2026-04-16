import { useState } from "react";

const monthlyData = [
  { month: "Jan", revenue: 45000, target: 60000 },
  { month: "Feb", revenue: 62000, target: 60000 },
  { month: "Mar", revenue: 58000, target: 60000 },
  { month: "Apr", revenue: 71000, target: 65000 },
  { month: "May", revenue: 89000, target: 65000 },
  { month: "Jun", revenue: 76000, target: 70000 },
  { month: "Jul", revenue: 95000, target: 70000 },
  { month: "Aug", revenue: 88000, target: 75000 },
  { month: "Sep", revenue: 102000, target: 75000 },
  { month: "Oct", revenue: 94000, target: 80000 },
  { month: "Nov", revenue: 110000, target: 80000 },
  { month: "Dec", revenue: 125000, target: 85000 },
];

const repBreakdown = [
  { name: "Sarah K.", revenue: 284500, color: "bg-primary" },
  { name: "Mike T.", revenue: 198000, color: "bg-[#7C5CFC]" },
  { name: "Priya R.", revenue: 176300, color: "bg-[#F59E0B]" },
  { name: "James C.", revenue: 152000, color: "bg-primary/60" },
  { name: "Lina V.", revenue: 134800, color: "bg-[#7C5CFC]/60" },
];

const totalRevenue = repBreakdown.reduce((s, r) => s + r.revenue, 0);

export function PerformanceCharts() {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      {/* Bar chart */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold">Monthly Revenue vs Target</span>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-sm bg-primary" /> Revenue
            </span>
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-sm bg-destructive/40" /> Target
            </span>
          </div>
        </div>
        <div className="flex items-end gap-1 h-36">
          {monthlyData.map((d, i) => {
            const barH = (d.revenue / maxRevenue) * 100;
            const targetH = (d.target / maxRevenue) * 100;
            const isHovered = hoveredMonth === i;
            const aboveTarget = d.revenue >= d.target;
            return (
              <div
                key={d.month}
                className="flex-1 flex flex-col items-center gap-0.5 relative cursor-pointer"
                onMouseEnter={() => setHoveredMonth(i)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {isHovered && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                    ${(d.revenue / 1000).toFixed(0)}k
                  </div>
                )}
                <div className="w-full relative" style={{ height: "100%" }}>
                  <div
                    className={`absolute bottom-0 left-0 right-0 rounded-t-sm transition-all ${
                      aboveTarget ? "bg-primary" : "bg-primary/50"
                    } ${isHovered ? "opacity-100" : "opacity-80"}`}
                    style={{ height: `${barH}%` }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 border-t-2 border-dashed border-destructive/40"
                    style={{ bottom: `${targetH}%` }}
                  />
                </div>
                <span className="text-[8px] text-muted-foreground mt-1">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donut-style breakdown */}
      <div>
        <span className="text-xs font-semibold mb-3 block">Revenue by Rep</span>
        <div className="space-y-2">
          {repBreakdown.map((r) => {
            const pct = ((r.revenue / totalRevenue) * 100).toFixed(1);
            return (
              <div key={r.name} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-16 shrink-0">{r.name}</span>
                <div className="flex-1 h-3 rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${r.color} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold w-12 text-right">{pct}%</span>
                <span className="text-[10px] text-muted-foreground w-14 text-right">
                  ${(r.revenue / 1000).toFixed(0)}k
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
