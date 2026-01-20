// Basic prompt injection protection for user input
// This is a simple example. For production, use a more robust solution.

export function sanitizeUserInput(input: string): string {
  // Remove common prompt injection patterns
  let sanitized = input;

  // Remove attempts to inject system prompts or instructions
  sanitized = sanitized.replace(/(system:|assistant:|user:|ignore previous instructions|forget previous instructions|reset|you are now|as an ai|prompt:|#|\n\s*\n)/gi, "");

  // Remove triple backticks (code blocks)
  sanitized = sanitized.replace(/```[\s\S]*?```/g, "");

  // Remove HTML/script tags
  sanitized = sanitized.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  sanitized = sanitized.replace(/<[^>]+>/g, "");

  // Optionally, limit input length
  sanitized = sanitized.slice(0, 1000);

  return sanitized.trim();
}
