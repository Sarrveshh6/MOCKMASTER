/**
 * Builds the OpenAI prompt to extract MCQ questions from PDF text.
 */
exports.buildExtractionPrompt = (text) => {
  return [
    {
      role: 'system',
      content: `You are an expert exam question extractor.
Your task is to EXTRACT multiple-choice questions (MCQs) that already exist in the provided text.

IMPORTANT RULES:
- ONLY extract questions that are ALREADY present in the text. Do NOT invent or generate new questions.
- If the text does not contain any MCQs, return an empty "questions" array: {"questions": []}
- Do NOT paraphrase or rewrite questions — copy them exactly as they appear.

You MUST respond with a valid JSON object with a single key "questions" which is an array.
Each item must have EXACTLY these fields:
- "questionText": string — the question text as it appears
- "options": array of exactly 4 strings — the answer choices
- "correctAnswer": string — must be one of the 4 options exactly
- "explanation": string — a brief explanation (can be empty string if not in the text)
- "difficulty": string — one of "Easy", "Medium", or "Hard"
- "subject": string — subject area (e.g., "Physics", "History", "General")
- "topic": string — specific topic

Extract as many questions as exist in the text (minimum 30 if available). Do not include any text outside the JSON object.`
    },
    {
      role: 'user',
      content: `Extract all MCQ questions from the following text:\n\n---\n${text}\n---`
    }
  ];
};

/**
 * Builds the OpenAI prompt to extract MCQ questions from images (Vision).
 */
exports.buildVisionExtractionPrompt = (base64Images) => {
  const content = [
    {
      type: 'text',
      text: `You are an expert exam question extractor. Look at the attached image(s) which contain exam papers or study material.

IMPORTANT RULES:
- ONLY extract Multiple Choice Questions (MCQs) that are ALREADY visible in the image(s). Do NOT invent or generate new questions.
- If no MCQs are found in the image(s), return an empty array: {"questions": []}
- Copy questions exactly as they appear — do not paraphrase or rewrite.

You MUST respond with a valid JSON object with a single key "questions" which is an array.
Each item must have EXACTLY these fields:
- "questionText": string
- "options": array of exactly 4 strings
- "correctAnswer": string (must be one of the options)
- "explanation": string (empty string if not present in image)
- "difficulty": string ("Easy", "Medium", or "Hard")
- "subject": string
- "topic": string

Do not include any text outside the JSON object.`
    }
  ];

  // Append images
  base64Images.forEach(base64 => {
    content.push({
      type: 'image_url',
      image_url: {
        url: `data:image/jpeg;base64,${base64}`,
        detail: 'low'
      }
    });
  });

  return [
    {
      role: 'user',
      content: content
    }
  ];
};
