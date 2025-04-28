import { EventBus } from "@/utils/event-bus";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";

export default function SidebarToggleButton({
  onClick,
  direction = "right",
  title,
}: {
  onClick: () => void;
  direction?: "left" | "right";
  title: string;
}) {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const flash = () => {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 1500);
    };

    EventBus.on("flashSidebarButton", flash);

    return () => {
      EventBus.off("flashSidebarButton", flash);
    };
  }, []);

  const isLeft = direction === "left";

  const baseClasses = `
    absolute top-4 transition-all duration-300 cursor-pointer 
    border-r border-b rounded-r-lg px-2 py-8 left-[calc(100%-0.05rem)]
    ${
      isLeft
        ? "bg-secondary-light border-secondary hover:bg-primary-lightest hover:text-primary-darker hover:border-primary"
        : "bg-primary-light border-primary hover:bg-secondary-lightest hover:text-secondary hover:border-secondary"
    }
    ${isFlashing && !isLeft ? "animate-flash" : ""}
  `;

  return (
    <button
      title={title}
      type="button"
      onClick={onClick}
      className={baseClasses}
      style={{ boxShadow: "4px 2px 4px -2px rgba(0, 0, 0, 0.1)" }}
    >
      <FaChevronRight className={isLeft ? "rotate-180" : ""} />
    </button>
  );
}
