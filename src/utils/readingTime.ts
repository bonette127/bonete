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

/**
 * Calculates the estimated reading time based on the article word count.
 * 
 * @param content The text content of the article (or excerpt)
 * @param wpm Reading speed in words per minute (default: 200 wpm)
 * @returns ReadingTimeResult containing minutes, formatted text, and wordCount
 */
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

  // Strip html tags, markdown tokens, and special symbols for clean word extraction
  const cleanContent = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*`_~[\]()]/g, ' ')
    .trim();

  // Split by whitespace to extract individual words
  const words = cleanContent.split(/\s+/).filter(Boolean);
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
