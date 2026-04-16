import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { DollarSign, GripVertical } from "lucide-react";

type Deal = {
  id: string;
  name: string;
  value: number;
  rep: string;
  color: string;
};

type Column = {
  id: string;
  title: string;
  color: string;
  deals: Deal[];
};

const initialColumns: Column[] = [
  {
    id: "prospecting",
    title: "Prospecting",
    color: "bg-muted-foreground/20",
    deals: [
      { id: "d1", name: "Acme Corp", value: 45000, rep: "Sarah K.", color: "border-l-primary" },
      { id: "d2", name: "Globex Inc", value: 28000, rep: "Mike T.", color: "border-l-[#7C5CFC]" },
    ],
  },
  {
    id: "negotiation",
    title: "Negotiation",
    color: "bg-[#F59E0B]/20",
    deals: [
      { id: "d3", name: "Initech", value: 67000, rep: "Priya R.", color: "border-l-[#F59E0B]" },
      { id: "d4", name: "Wayne Ent.", value: 120000, rep: "Sarah K.", color: "border-l-primary" },
    ],
  },
  {
    id: "proposal",
    title: "Proposal Sent",
    color: "bg-[#7C5CFC]/20",
    deals: [
      { id: "d5", name: "Stark Ind.", value: 89000, rep: "Mike T.", color: "border-l-[#7C5CFC]" },
    ],
  },
  {
    id: "closed",
    title: "Closed Won",
    color: "bg-primary/20",
    deals: [
      { id: "d6", name: "Oscorp", value: 52000, rep: "Priya R.", color: "border-l-primary" },
    ],
  },
];

function DealCard({ deal, isDragging }: { deal: Deal; isDragging?: boolean }) {
  return (
    <div
      className={`border-l-4 ${deal.color} rounded border border-border/40 bg-card p-3 shadow-sm transition-shadow ${isDragging ? "shadow-lg opacity-80" : "hover:shadow-md"}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">{deal.name}</span>
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">{deal.rep}</span>
        <span className="flex items-center gap-0.5 text-xs font-semibold text-primary">
          <DollarSign className="h-3 w-3" />
          {(deal.value / 1000).toFixed(0)}k
        </span>
      </div>
    </div>
  );
}

function SortableDealCard({ deal }: { deal: Deal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <DealCard deal={deal} isDragging={isDragging} />
    </div>
  );
}

function DroppableColumn({ column }: { column: Column }) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const total = column.deals.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col min-w-[200px]">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${column.color.replace("/20", "")}`} />
          <span className="text-xs font-semibold">{column.title}</span>
        </div>
        <span className="text-[10px] text-muted-foreground">{column.deals.length} deals</span>
      </div>
      <div className="text-xs font-semibold text-primary mb-2">
        ${(total / 1000).toFixed(0)}k total
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-lg border border-dashed border-border/50 ${column.color} p-2 min-h-[120px] space-y-2`}
      >
        <SortableContext items={column.deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {column.deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export function DealKanban() {
  const [columns, setColumns] = useState(initialColumns);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function findDealColumn(dealId: string) {
    return columns.find((c) => c.deals.some((d) => d.id === dealId));
  }

  function handleDragStart(event: DragStartEvent) {
    const col = findDealColumn(event.active.id as string);
    const deal = col?.deals.find((d) => d.id === event.active.id);
    setActiveDeal(deal ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDeal(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceCol = findDealColumn(activeId);
    if (!sourceCol) return;

    // Determine target column
    let targetCol = columns.find((c) => c.id === overId);
    if (!targetCol) {
      targetCol = findDealColumn(overId);
    }
    if (!targetCol) return;

    if (sourceCol.id === targetCol.id) return;

    const deal = sourceCol.deals.find((d) => d.id === activeId);
    if (!deal) return;

    setColumns((prev) =>
      prev.map((c) => {
        if (c.id === sourceCol.id) return { ...c, deals: c.deals.filter((d) => d.id !== activeId) };
        if (c.id === targetCol!.id) return { ...c, deals: [...c.deals, deal] };
        return c;
      })
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {columns.map((col) => (
          <DroppableColumn key={col.id} column={col} />
        ))}
      </div>
      <DragOverlay>{activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}</DragOverlay>
    </DndContext>
  );
}
