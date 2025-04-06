import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import confetti from "canvas-confetti";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fireConfettiFromClick = (e: React.MouseEvent) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  confetti({
    particleCount: 100,
    spread: 360,

    origin: { x, y },
  });
};