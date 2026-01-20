// Utility function to get environment variables safely
export function getEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (!value)
    throw new Error(`${key} is not set in the environment variables.`);
  return value;
}
