import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column, { ColumnType } from "./Column";
import { useState, useEffect } from "react";
import { data } from "../utils/data";
import AddCard from "./AddCard";

export default function Board() {
  const [columns, setColumns] = useState<ColumnType[]>(() => {
    const savedColumns = localStorage.getItem("columns");
    return savedColumns ? JSON.parse(savedColumns) : data;
  });
  const [newColumnTitle, setNewColumnTitle] = useState("");

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  const findColumn = (unique: string | null) => {
    if (!unique) {
      return null;
    }
    if (columns.some((c) => c.id === unique)) {
      return columns.find((c) => c.id === unique) ?? null;
    }
    const id = String(unique);
    const itemWithColumnId = columns.flatMap((c) => {
      const columnId = c.id;
      return c.cards.map((i) => ({ itemId: i.id, columnId: columnId }));
    });
    const columnId = itemWithColumnId.find((i) => i.itemId === id)?.columnId;
    return columns.find((c) => c.id === columnId) ?? null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over, delta } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return;
    }
    setColumns((prevState) => {
      const activeItems = activeColumn.cards;
      const overItems = overColumn.cards;
      const activeIndex = activeItems.findIndex((i) => i.id === activeId);
      const overIndex = overItems.findIndex((i) => i.id === overId);
      const newIndex = () => {
        const putOnBelowLastItem =
          overIndex === overItems.length - 1 && delta.y > 0;
        const modifier = putOnBelowLastItem ? 1 : 0;
        return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      };
      return prevState.map((c) => {
        if (c.id === activeColumn.id) {
          c.cards = activeItems.filter((i) => i.id !== activeId);
          return c;
        } else if (c.id === overColumn.id) {
          c.cards = [
            ...overItems.slice(0, newIndex()),
            activeItems[activeIndex],
            ...overItems.slice(newIndex(), overItems.length)
          ];
          return c;
        } else {
          return c;
        }
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn) {
      return;
    }
    const activeIndex = activeColumn.cards.findIndex((i) => i.id === activeId);
    const overIndex = overColumn.cards.findIndex((i) => i.id === overId);
    if (activeColumn.id !== overColumn.id || activeIndex !== overIndex) {
      setColumns((prevState) => {
        return prevState.map((column) => {
          if (column.id === activeColumn.id) {
            column.cards = column.id === overColumn.id
              ? arrayMove(column.cards, activeIndex, overIndex)
              : column.cards.filter((i) => i.id !== activeId);
          }
          if (column.id === overColumn.id && column.id !== activeColumn.id) {
            column.cards = [
              ...column.cards.slice(0, overIndex),
              activeColumn.cards[activeIndex],
              ...column.cards.slice(overIndex)
            ];
          }
          return column;
        });
      });
    }
  };

  const handleAddCard = (columnId: string, title: string) => {
    const newCard = { id: Date.now().toString(), title };
    setColumns((prevState) =>
      prevState.map((column) =>
        column.id === columnId
          ? { ...column, cards: [...column.cards, newCard] }
          : column
      )
    );
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    setColumns((prevState) =>
      prevState.map((column) =>
        column.id === columnId
          ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) }
          : column
      )
    );
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColumnTitle.trim()) {
      const newColumn = {
        id: Date.now().toString(),
        title: newColumnTitle,
        cards: []
      };
      setColumns((prevState) => [...prevState, newColumn]);
      setNewColumnTitle("");
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this column?");
    if (confirmed) {
      setColumns((prevState) => prevState.filter((column) => column.id !== columnId));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="App flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 p-4 justify-center w-full overflow-x-auto">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0">
            <Column
              id={column.id}
              title={column.title}
              cards={column.cards}
              handleDeleteCard={handleDeleteCard}
            />
            <div className="mt-2">
              <AddCard columnId={column.id} handleAddCard={handleAddCard} />
            </div>
            <button
              onClick={() => handleDeleteColumn(column.id)}
              className="mt-2 rounded bg-red-500 px-3 py-1.5 text-xs text-white transition-colors hover:bg-red-700"
            >
              Delete Column
            </button>
          </div>
        ))}
        <form onSubmit={handleAddColumn} className="flex flex-col space-y-2">
          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="Add new column"
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <button
            type="submit"
            className="rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
          >
            Add Column
          </button>
        </form>
      </div>
    </DndContext>
  );
}