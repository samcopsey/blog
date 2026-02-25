/**
 * Estimates reading time from a content body string.
 * Assumes an average reading speed of 200 words per minute.
 */
export function getReadingTime(body: string | undefined): number {
  const words = body?.trim().split(/\s+/).length ?? 0;
  return Math.max(1, Math.ceil(words / 200));
}
