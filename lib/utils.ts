import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import confetti from "canvas-confetti";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDistance(a: [number, number], b: [number, number]) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

export const fireConfetti = (e?: React.MouseEvent) => {
  const x = e ? e.clientX / window.innerWidth : .5;
  const y = e ? e.clientY / window.innerHeight: .5;

  confetti({
    particleCount: 100,
    spread: 360,

    origin: { x, y },
  });
};

export const miniConfetti = () => {
  confetti({
    particleCount: 50,
    spread: 180,
    startVelocity: 40,
    origin: {x: 0.5, y: 0.45},

  });
}