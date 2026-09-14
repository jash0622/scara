"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render: (item: T) => React.ReactNode;
}

interface ReorderableTableProps<T extends { id: string }> {
  items: T[];
  columns: Column<T>[];
  onReorder: (newOrder: T[]) => void;
  onRowClick?: (item: T) => void;
  emptyState?: React.ReactNode;
  loading?: boolean;
}

export function ReorderableTable<T extends { id: string }>({
  items,
  columns,
  onReorder,
  onRowClick,
  emptyState,
  loading,
}: ReorderableTableProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    onReorder(arrayMove(items, oldIdx, newIdx));
  }

  if (loading) {
    return (
      <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }} />
              {columns.map((col) => <th key={col.key}>{col.header}</th>)}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td><div className="skeleton" style={{ width: "16px", height: "16px" }} /></td>
                {columns.map((col) => (
                  <td key={col.key}>
                    <div className="skeleton" style={{ height: "14px", width: col.width ?? "80%" }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!items.length && emptyState) {
    return <>{emptyState}</>;
  }

  const activeItem = items.find((i) => i.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          border: "1px solid var(--border-subtle)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }} aria-label="Drag to reorder" />
              {columns.map((col) => (
                <th key={col.key} style={col.width ? { width: col.width } : {}}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <tbody>
              {items.map((item) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  columns={columns}
                  onRowClick={onRowClick}
                  isDragging={item.id === activeId}
                />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </div>

      {/* Drag overlay — shows lifted row */}
      <DragOverlay>
        {activeItem && (
          <table className="data-table" style={{ opacity: 0.95 }}>
            <tbody>
              <tr
                style={{
                  backgroundColor: "var(--bg-surface-raised)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <td style={{ width: "40px", paddingLeft: "12px" }}>
                  <GripVertical size={14} style={{ color: "var(--accent)" }} />
                </td>
                {columns.map((col) => (
                  <td key={col.key}>{col.render(activeItem)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function SortableRow<T extends { id: string }>({
  item,
  columns,
  onRowClick,
  isDragging,
}: {
  item: T;
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isDragging: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: onRowClick ? "pointer" : "default",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      onClick={() => onRowClick?.(item)}
    >
      {/* Drag handle — stops row click from triggering on handle */}
      <td
        onClick={(e) => e.stopPropagation()}
        style={{ width: "40px", paddingLeft: "12px", cursor: "grab" }}
        {...attributes}
        {...listeners}
      >
        <GripVertical
          size={14}
          style={{ color: "var(--text-muted)", display: "block" }}
        />
      </td>
      {columns.map((col) => (
        <td key={col.key}>{col.render(item)}</td>
      ))}
    </tr>
  );
}
