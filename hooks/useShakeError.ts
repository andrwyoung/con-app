import { useState } from "react";

export default function useShakeError(initial = "") {
    const [error, setError] = useState(initial);
    const [shake, setShake] = useState(false);
  
    const triggerError = (message: string) => {
      setError(message);
      setShake(true);
      setTimeout(() => setShake(false), 400);
    };
  
    return { error, setError, shake, triggerError };
  }