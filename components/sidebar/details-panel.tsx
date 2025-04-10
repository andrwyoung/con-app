import { EventInfo } from "@/types/types";
import { FiX } from "react-icons/fi";

export default function DetailsPanel({
  con,
  onClose,
}: {
  con: EventInfo;
  onClose: () => void;
}) {
  return (
    <div className="absolute left-[22rem] top-12 w-80 max-h-180 bg-white rounded-lg shadow-lg z-17">
      <button
        type="button"
        className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-600 hover:scale-105"
        onClick={onClose}
        aria-label="close details panel"
      >
        <FiX />
      </button>
      <div className="flex flex-col px-4 pt-8 pb-6 gap-8">
        <h2 className="text-2xl font-semibold">{con.name}</h2>
        <div className="flex flex-col">
          <p className="text-xs text-primary-muted">{con.date}</p>
          <p className="text-sm mt-2">{con.venue}</p>
        </div>
      </div>
    </div>
  );
}
