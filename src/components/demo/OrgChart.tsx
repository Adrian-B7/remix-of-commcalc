import { useState } from "react";
import { ChevronDown, ChevronRight, Users, User, DollarSign } from "lucide-react";

type OrgNode = {
  id: string;
  name: string;
  role: string;
  revenue: number;
  reps?: OrgNode[];
};

const orgData: OrgNode = {
  id: "vp",
  name: "Alex Morgan",
  role: "VP Sales",
  revenue: 945600,
  reps: [
    {
      id: "dir1",
      name: "Sarah Kim",
      role: "Director, Enterprise",
      revenue: 462500,
      reps: [
        { id: "r1", name: "Mike Torres", role: "Sr. AE", revenue: 198000 },
        { id: "r2", name: "James Chen", role: "AE", revenue: 152000 },
        { id: "r3", name: "Dana Wu", role: "AE", revenue: 112500 },
      ],
    },
    {
      id: "dir2",
      name: "Priya Rao",
      role: "Director, Mid-Market",
      revenue: 483100,
      reps: [
        { id: "r4", name: "Lina Vasquez", role: "Sr. AE", revenue: 198300 },
        { id: "r5", name: "Tom Brady", role: "AE", revenue: 156000 },
        { id: "r6", name: "Aisha Patel", role: "AE", revenue: 128800 },
      ],
    },
  ],
};

function OrgNodeCard({ node, depth = 0 }: { node: OrgNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.reps && node.reps.length > 0;

  const depthColors = [
    "border-l-primary bg-primary/5",
    "border-l-[#7C5CFC] bg-[#7C5CFC]/5",
    "border-l-[#F59E0B] bg-[#F59E0B]/5",
  ];

  return (
    <div className="relative">
      <div
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`rounded border border-border/40 border-l-4 ${depthColors[depth] ?? depthColors[2]} p-3 mb-2 transition-all ${
          hasChildren ? "cursor-pointer hover:shadow-sm" : ""
        }`}
      >
        <div className="flex items-center gap-2.5">
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )
          ) : (
            <User className="h-3.5 w-3.5 text-muted-foreground/50" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">{node.name}</span>
              {hasChildren && (
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {node.reps!.length}
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">{node.role}</span>
          </div>
          <div className="text-right">
            <span className="flex items-center gap-0.5 text-xs font-semibold text-primary">
              <DollarSign className="h-3 w-3" />
              {(node.revenue / 1000).toFixed(0)}k
            </span>
          </div>
        </div>
        {/* Revenue bar */}
        <div className="mt-2 h-1.5 rounded-full bg-muted/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/60 transition-all"
            style={{ width: `${Math.min((node.revenue / orgData.revenue) * 100, 100)}%` }}
          />
        </div>
      </div>
      {hasChildren && expanded && (
        <div className="ml-4 pl-3 border-l border-border/30">
          {node.reps!.map((child) => (
            <OrgNodeCard key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OrgChart() {
  return <OrgNodeCard node={orgData} />;
}
