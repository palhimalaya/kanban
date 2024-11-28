import { FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { FiTrash } from "react-icons/fi";

export type CardType = {
  id: string;
  title: string;
};

interface CardProps {
  id: string;
  title: string;
  columnId: string;
  handleDeleteCard: (columnId: string, cardId: string) => void;
}

const Card: FC<CardProps> = ({ id, title, columnId, handleDeleteCard }) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete this column?");
    if (confirmed) {
      handleDeleteCard(columnId, id);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    columnId: string,
    cardId: string
  ) => {
    e.stopPropagation();
    if (e.key === "Enter" || e.key === " ") {
      handleDeleteCard(columnId, cardId);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className="m-2.5 bg-white p-2.5 rounded-lg shadow-md text-gray-800 flex items-center justify-between"
    >
      <div id={id} {...listeners} className="flex-grow cursor-grab">
        <p className="font-medium">{title}</p>
      </div>

      <button
        onClick={handleClick}
        onKeyDown={(e) => handleKeyDown(e, columnId, id)}
        tabIndex={0}
        className="text-red-500 hover:text-red-700"
        aria-label={`Delete card ${title}`}
      >
        <FiTrash />
      </button>
    </div>
  );
};

export default Card;
