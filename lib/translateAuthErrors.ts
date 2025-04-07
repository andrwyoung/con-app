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