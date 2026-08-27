/**
 * Standard 6-Dot English Braille (Grade 1) Chord Mappings
 * 
 * Column Layout:
 * Left Column:  4, 5, 6
 * Right Column: 1, 2, 3
 */

export interface BrailleMapping {
  dots: number[]; // sorted array of dot numbers [1, 2, ...]
  char: string;
  name: string;
  type: 'letter' | 'number' | 'punctuation' | 'command';
}

export const BRAILLE_MAP: BrailleMapping[] = [
  // Letters A-Z
  { dots: [1], char: 'a', name: 'A', type: 'letter' },
  { dots: [1, 2], char: 'b', name: 'B', type: 'letter' },
  { dots: [1, 4], char: 'c', name: 'C', type: 'letter' },
  { dots: [1, 4, 5], char: 'd', name: 'D', type: 'letter' },
  { dots: [1, 5], char: 'e', name: 'E', type: 'letter' },
  { dots: [1, 2, 4], char: 'f', name: 'F', type: 'letter' },
  { dots: [1, 2, 4, 5], char: 'g', name: 'G', type: 'letter' },
  { dots: [1, 2, 5], char: 'h', name: 'H', type: 'letter' },
  { dots: [2, 4], char: 'i', name: 'I', type: 'letter' },
  { dots: [2, 4, 5], char: 'j', name: 'J', type: 'letter' },
  { dots: [1, 3], char: 'k', name: 'K', type: 'letter' },
  { dots: [1, 2, 3], char: 'l', name: 'L', type: 'letter' },
  { dots: [1, 3, 4], char: 'm', name: 'M', type: 'letter' },
  { dots: [1, 3, 4, 5], char: 'n', name: 'N', type: 'letter' },
  { dots: [1, 3, 5], char: 'o', name: 'O', type: 'letter' },
  { dots: [1, 2, 3, 4], char: 'p', name: 'P', type: 'letter' },
  { dots: [1, 2, 3, 4, 5], char: 'q', name: 'Q', type: 'letter' },
  { dots: [1, 2, 3, 5], char: 'r', name: 'R', type: 'letter' },
  { dots: [2, 3, 4], char: 's', name: 'S', type: 'letter' },
  { dots: [2, 3, 4, 5], char: 't', name: 'T', type: 'letter' },
  { dots: [1, 3, 6], char: 'u', name: 'U', type: 'letter' },
  { dots: [1, 2, 3, 6], char: 'v', name: 'V', type: 'letter' },
  { dots: [2, 4, 5, 6], char: 'w', name: 'W', type: 'letter' },
  { dots: [1, 3, 4, 6], char: 'x', name: 'X', type: 'letter' },
  { dots: [1, 3, 4, 5, 6], char: 'y', name: 'Y', type: 'letter' },
  { dots: [1, 3, 5, 6], char: 'z', name: 'Z', type: 'letter' },

  // Common Punctuation
  { dots: [2, 5, 6], char: '.', name: 'Period', type: 'punctuation' },
  { dots: [2], char: ',', name: 'Comma', type: 'punctuation' },
  { dots: [2, 3, 6], char: '?', name: 'Question mark', type: 'punctuation' },
  { dots: [2, 3, 5], char: '!', name: 'Exclamation mark', type: 'punctuation' },
  { dots: [3], char: "'", name: 'Apostrophe', type: 'punctuation' },
  { dots: [3, 6], char: '-', name: 'Hyphen', type: 'punctuation' },
];

/**
 * Match dot combination to Braille character
 */
export function lookupBraille(dots: number[]): BrailleMapping | null {
  if (!dots || dots.length === 0) return null;
  const sorted = [...dots].sort((a, b) => a - b);
  const key = sorted.join(',');

  const match = BRAILLE_MAP.find(
    (item) => item.dots.slice().sort((a, b) => a - b).join(',') === key
  );

  return match || null;
}

/**
 * Returns Unicode Braille pattern character (U+2800 to U+28FF)
 */
export function getBrailleUnicode(dots: number[]): string {
  if (!dots || dots.length === 0) return '⠀';
  let mask = 0;
  dots.forEach((dot) => {
    if (dot >= 1 && dot <= 6) {
      mask |= 1 << (dot - 1);
    }
  });
  return String.fromCharCode(0x2800 + mask);
}
