// Simple ID generator (no uuid dependency needed)
let counter = 0;
export function generateId() {
  counter++;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}-${counter}`;
}
