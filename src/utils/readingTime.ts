/**
 * Utility to calculate estimated reading time and word count for articles.
 * Based on standard adult silent reading speed of 200 words per minute.
 */

export interface ReadingTimeResult {
  minutes: number;
  text: string;
  wordCount: number;
  wpm: number;
}

export function calculateReadingTime(
  content: string | undefined | null,
  wpm: number = 200
): ReadingTimeResult {
  if (!content || !content.trim()) {
    return {
      minutes: 1,
      text: '1 min read',
      wordCount: 0,
      wpm,
    };
  }

  // Split by whitespace to extract individual words
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Calculate minutes, minimum 1 min
  const minutes = Math.max(1, Math.ceil(wordCount / wpm));

  return {
    minutes,
    text: `${minutes} min read`,
    wordCount,
    wpm,
  };
}
