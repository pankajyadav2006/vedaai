import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export const generatePaper = async (data: any) => {
  const { subject, grade, additionalInfo, fileContent, questionTypes } = data;

  const questionDistribution = questionTypes.map((q: any) => `- ${q.type}: ${q.count} questions, ${q.marksEach} marks each`).join('\n');

  const prompt = `
You are an expert teacher creating a professional exam paper.

Subject: ${subject}
Grade: ${grade}
Additional Instructions: ${additionalInfo || 'None'}
${fileContent ? `Base questions on this content:\n${fileContent}` : ''}

Question distribution:
${questionDistribution}

Rules:
- Mix difficulty ~40% Easy, ~40% Moderate, ~20% Challenging
- Label each question difficulty as exactly one of: Easy, Moderate, Challenging
- Group by type into sections (Section A = first type, B = second, etc.)
- For MCQ: always provide exactly 4 options: (a) (b) (c) (d)
- Do NOT include answers inside questions array
- School name: "Delhi Public School, Sector-4, Bokaro"
- Calculate time: ~1.5 minutes per mark

Return ONLY valid JSON, no markdown, no backticks, no explanation:
{
  "schoolName": "Delhi Public School, Sector-4, Bokaro",
  "subject": "${subject}",
  "grade": "${grade}",
  "timeAllowed": "string",
  "totalMarks": number,
  "sections": [
    {
      "title": "Section A",
      "questionType": "string",
      "instruction": "Attempt all questions. Each question carries X marks.",
      "questions": [
        {
          "number": 1,
          "text": "Question text here",
          "difficulty": "Easy",
          "marks": 2,
          "options": []
        }
      ]
    }
  ],
  "answerKey": [
    { "number": 1, "answer": "Answer text here" }
  ]
}
`;

  let rawContent = '';

  if (genAI) {
    // Use Gemini (Free tier available)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    rawContent = result.response.text();
  } else if (anthropic) {
    // Use Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });
    rawContent = response.content[0].type === 'text' ? response.content[0].text : '';
  } else {
    throw new Error('No AI API key found. Please add GEMINI_API_KEY or ANTHROPIC_API_KEY to your .env file.');
  }

  return parseAndValidate(rawContent);
};

export const parseAndValidate = (raw: string) => {
  const clean = raw.replace(/```json|```/g, '').trim();
  let parsed: any;
  try {
    parsed = JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Could not extract JSON from LLM response');
    parsed = JSON.parse(match[0]);
  }
  
  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error('Invalid structure: missing sections array');
  }

  const validDifficulty = ['Easy', 'Moderate', 'Challenging'];
  parsed.sections.forEach((s: any) => {
    s.questions?.forEach((q: any) => {
      if (!validDifficulty.includes(q.difficulty)) q.difficulty = 'Moderate';
    });
  });
  return parsed;
};
