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
    id: id
  });

  const style = {
    transform: CSS.Transform.toString(transform)
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, columnId: string, cardId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleDeleteCard(columnId, cardId);
    }
  };

  const handleClick = () => {
    console.log('Click event triggered');
    handleDeleteCard(columnId, id);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="m-2.5 bg-white p-2.5 rounded-lg shadow-md text-gray-800 flex items-center justify-between"
    >
      <div id={id}>
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