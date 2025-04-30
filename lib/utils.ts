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

export const log = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

export const miniConfetti = () => {
  confetti({
    particleCount: 50,
    spread: 180,
    startVelocity: 40,
    origin: {x: 0.5, y: 0.45},

  });
}


// UNUSED. TODO
export function translateAuthError(message: string): string {
  if (!message) return "Something went wrong. Please try again.";

  const cleaned = message.toLowerCase();

  if (cleaned.includes("for security purposes")) {
    return "Please wait 30 seconds before trying again.";
  }

  if (cleaned.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }

  if (cleaned.includes("email not confirmed")) {
    return "Please confirm your email before logging in.";
  }

  if (cleaned.includes("rate limit")) {
    return "Too many requests. Please wait and try again.";
  }

  return message; // fallback to raw message if no match
}


export function getRandomEncouragement(): string {
  const messages = [
    "Nice!",
    "Thanks!",
    "Woah kay",
    "Saved!",
    "Yay",
    ":>",
    ":0"
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}