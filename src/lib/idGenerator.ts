/**
 * Generates a unique citizen issue reference code in format:
 * WARD14-XXXXXX (6 alphanumeric characters)
 */
export function generateReferenceId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // excluded confusing chars 0, 1, I, O
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomPart += chars[randomIndex];
  }
  return `WARD14-${randomPart}`;
}
