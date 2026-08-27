import mammoth from 'mammoth';
import { EducationalLesson } from '../types/isl';

/**
 * Extract raw text from uploaded File (.txt or .docx)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text || '');
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  }

  if (fileName.endsWith('.docx')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value || '');
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }

  throw new Error('Unsupported file format. Please upload a .txt or .docx file.');
}

/**
 * Split text into educational sentences
 */
export function splitIntoSentences(text: string): string[] {
  if (!text) return [];

  // Normalize newlines and clean spaces
  const cleaned = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Split on sentence boundaries (. ! ?) or clean paragraph lines
  const rawSentences = cleaned
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /[a-zA-Z0-9]/.test(s));

  return rawSentences;
}

/**
 * Pre-loaded accessible sample lessons
 */
export const SAMPLE_LESSONS: EducationalLesson[] = [
  {
    id: 'lesson_school_tomorrow',
    title: 'School Schedule & Routine',
    category: 'Everyday School',
    difficulty: 'Beginner',
    description: 'Everyday school routine including tomorrow\'s class schedules and teacher instructions.',
    content: `The student will go to school tomorrow.
The teacher will teach a new book today.
We should read and write our lesson carefully.
My friend wants to help with homework.`
  },
  {
    id: 'lesson_science_plants',
    title: 'Science: Plants & Sunlight',
    category: 'Elementary Science',
    difficulty: 'Intermediate',
    description: 'Learn how green plants use sunlight and water for growth.',
    content: `Green plants need sun and water to grow.
Leaves make food during the morning.
Water comes from earth into the tree.
Why do plants need bright light?`
  },
  {
    id: 'lesson_social_greetings',
    title: 'Social Greetings & Interaction',
    category: 'Social Interaction',
    difficulty: 'Beginner',
    description: 'Essential polite phrases and social conversation in Indian Sign Language.',
    content: `Namaste, hello my dear friend.
Thank you for your kind help today.
Please understand my question.
I will see my family now.`
  },
  {
    id: 'lesson_daily_study',
    title: 'Exam Preparation & Study Plan',
    category: 'Academic Preparation',
    difficulty: 'Intermediate',
    description: 'Preparing for school examinations, answering questions, and morning study.',
    content: `Students must study for the exam tomorrow.
Teacher will ask a difficult question.
I can understand and write the correct answer.
We will not stop learning.`
  }
];
