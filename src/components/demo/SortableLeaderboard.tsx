import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trophy, TrendingUp, TrendingDown } from "lucide-react";

type Rep = {
  id: string;
  name: string;
  revenue: number;
  deals: number;
  attainment: number;
  trend: "up" | "down";
  avatar: string;
};

const initialReps: Rep[] = [
  { id: "r1", name: "Sarah Kim", revenue: 284500, deals: 12, attainment: 142, trend: "up", avatar: "SK" },
  { id: "r2", name: "Mike Torres", revenue: 198000, deals: 8, attainment: 99, trend: "up", avatar: "MT" },
  { id: "r3", name: "Priya Rao", revenue: 176300, deals: 10, attainment: 88, trend: "down", avatar: "PR" },
  { id: "r4", name: "James Chen", revenue: 152000, deals: 7, attainment: 76, trend: "up", avatar: "JC" },
  { id: "r5", name: "Lina Vasquez", revenue: 134800, deals: 9, attainment: 67, trend: "down", avatar: "LV" },
];

function SortableRepRow({ rep, rank }: { rep: Rep; rank: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: rep.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const medalColors = ["text-[#F59E0B]", "text-muted-foreground", "text-[#CD7F32]"];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center gap-3 rounded border border-border/30 bg-card p-3 transition-shadow ${isDragging ? "shadow-lg z-10 opacity-90" : "hover:shadow-sm"}`}
    >
      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground/40" />
      </div>
      <div className="w-6 text-center">
        {rank <= 3 ? (
          <Trophy className={`h-4 w-4 ${medalColors[rank - 1]}`} />
        ) : (
          <span className="text-xs text-muted-foreground">{rank}</span>
        )}
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
        {rep.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate">{rep.name}</p>
        <p className="text-[10px] text-muted-foreground">{rep.deals} deals</p>
      </div>
      <div className="text-right">
        <p className="text-xs font-semibold">${(rep.revenue / 1000).toFixed(0)}k</p>
        <div className="flex items-center justify-end gap-0.5">
          {rep.trend === "up" ? (
            <TrendingUp className="h-3 w-3 text-primary" />
          ) : (
            <TrendingDown className="h-3 w-3 text-destructive" />
          )}
          <span className={`text-[10px] font-medium ${rep.trend === "up" ? "text-primary" : "text-destructive"}`}>
            {rep.attainment}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function SortableLeaderboard() {
  const [reps, setReps] = useState(initialReps);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setReps((prev) => {
      const oldIndex = prev.findIndex((r) => r.id === active.id);
      const newIndex = prev.findIndex((r) => r.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={reps.map((r) => r.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {reps.map((rep, i) => (
            <SortableRepRow key={rep.id} rep={rep} rank={i + 1} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
