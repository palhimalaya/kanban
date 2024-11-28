import { FC } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card, { CardType } from "./Card";

export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
};

interface ColumnProps {
  id: string;
  title: string;
  cards: CardType[];
  handleDeleteCard: (columnId: string, cardId: string) => void;
}

const Column: FC<ColumnProps> = ({ id, title, cards, handleDeleteCard }) => {
  const { setNodeRef } = useDroppable({ id: id });

  return (
    <SortableContext id={id} items={cards} strategy={rectSortingStrategy}>
      <div
        ref={setNodeRef}
        className="w-64 bg-gray-100 mr-2.5 p-4 rounded-lg shadow-md"
      >
        <div className="border-b border-gray-300 pb-2 mb-4">
          <p className="text-lg font-semibold text-gray-700">{title}</p>
        </div>
        <div className="space-y-4">
          {cards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              title={card.title}
              columnId={id}
              handleDeleteCard={handleDeleteCard}
            />
          ))}
        </div>
      </div>
    </SortableContext>
  );
};

export default Column;