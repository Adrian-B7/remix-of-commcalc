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
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tier = {
  id: string;
  name: string;
  minDeal: number;
  maxDeal: number;
  rate: number;
  color: string;
};

const initialTiers: Tier[] = [
  { id: "t1", name: "Bronze", minDeal: 0, maxDeal: 25000, rate: 5, color: "bg-[#CD7F32]" },
  { id: "t2", name: "Silver", minDeal: 25001, maxDeal: 75000, rate: 8, color: "bg-muted-foreground" },
  { id: "t3", name: "Gold", minDeal: 75001, maxDeal: 150000, rate: 12, color: "bg-[#F59E0B]" },
  { id: "t4", name: "Platinum", minDeal: 150001, maxDeal: 500000, rate: 18, color: "bg-primary" },
];

function SortableTierRow({ tier, onRemove }: { tier: Tier; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tier.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center gap-3 rounded border border-border/30 bg-card p-3 transition-shadow ${
        isDragging ? "shadow-lg z-10" : "hover:shadow-sm"
      }`}
    >
      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground/40" />
      </div>
      <div className={`h-3 w-3 rounded-full ${tier.color}`} />
      <span className="text-xs font-semibold w-20">{tier.name}</span>
      <div className="flex-1 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[9px] text-muted-foreground">Min Deal</p>
          <p className="text-xs font-mono">${(tier.minDeal / 1000).toFixed(0)}k</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground">Max Deal</p>
          <p className="text-xs font-mono">${(tier.maxDeal / 1000).toFixed(0)}k</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground">Rate</p>
          <p className="text-xs font-mono font-bold text-primary">{tier.rate}%</p>
        </div>
      </div>
      {/* Stacked bar */}
      <div className="w-20 h-4 rounded-full bg-muted/50 overflow-hidden">
        <div
          className={`h-full rounded-full ${tier.color} transition-all`}
          style={{ width: `${(tier.rate / 20) * 100}%` }}
        />
      </div>
      <button
        onClick={onRemove}
        className="p-1 rounded hover:bg-destructive/10 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5 text-destructive/60 hover:text-destructive" />
      </button>
    </div>
  );
}

export function CompTierBuilder() {
  const [tiers, setTiers] = useState(initialTiers);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setTiers((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  function addTier() {
    const id = `t${Date.now()}`;
    const colors = ["bg-[#7C5CFC]", "bg-[#F59E0B]", "bg-primary", "bg-[#CD7F32]"];
    setTiers((prev) => [
      ...prev,
      {
        id,
        name: `Tier ${prev.length + 1}`,
        minDeal: prev.length > 0 ? (prev[prev.length - 1].maxDeal + 1) : 0,
        maxDeal: prev.length > 0 ? (prev[prev.length - 1].maxDeal + 100000) : 50000,
        rate: Math.min(20, (prev.length + 1) * 4),
        color: colors[prev.length % colors.length],
      },
    ]);
  }

  function removeTier(id: string) {
    setTiers((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tiers.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tiers.map((tier) => (
            <SortableTierRow key={tier.id} tier={tier} onRemove={() => removeTier(tier.id)} />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outline" size="sm" onClick={addTier} className="w-full gap-1.5 text-xs">
        <Plus className="h-3.5 w-3.5" />
        Add Tier
      </Button>
    </div>
  );
}
