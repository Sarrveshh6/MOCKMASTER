const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

let openaiClient = null;
let resolvedModel = 'gpt-4o-mini';
let isOpenRouterClient = false;
let geminiClient = null;

const getOpenAIClient = () => {
  const openRouterKey = process.env.OPENROUTER_API_KEY || (process.env.OPENAI_API_KEY?.startsWith('sk-or-v1-') ? process.env.OPENAI_API_KEY : null);
  
  if (openRouterKey) {
    isOpenRouterClient = true;
    return new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: openRouterKey,
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'MockMaster',
      },
    });
  }

  if (process.env.OPENAI_API_KEY) {
    isOpenRouterClient = false;
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return null;
};

const getGroqClient = () => {
  if (process.env.GROQ_API_KEY) {
    // Groq is OpenAI-compatible
    return new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return null;
};

const getGeminiClient = () => {
  const key = (process.env.GOOGLE_API_KEY || '').trim();
  if (!key) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(key);
  }
  return geminiClient;
};

const getVisionModel = () => {
  if (isOpenRouterClient) {
    return process.env.OPENROUTER_VISION_MODEL || process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
  }
  return process.env.OPENAI_VISION_MODEL || 'gpt-4o-mini';
};

const getTextFromMessages = (messages = []) => {
  const userMessage = messages.find((m) => m.role === 'user')?.content || '';
  const markers = [
    'Extract all MCQ questions from the following text:',
    'Extract or generate mock test questions from the following text:',
  ];
  let raw = userMessage;
  for (const marker of markers) {
    if (userMessage.includes(marker)) {
      raw = userMessage.split(marker).slice(1).join(marker);
      break;
    }
  }
  // If no marker is found, use the whole thing (best effort)
  return raw.replace(/^(\s*---\s*)|(\s*---\s*)$/g, '').trim();
};

const extractOptionMap = (block) => {
  // Ultra-flexible regex to catch A) B) C) D) even on the same line
  const optionRegex = /(?:^|\s)[\(\[]?([A-D])[\)\]\.\:\-\s]\s*(.+?)(?=(?:\s+[\(\[]?[A-D][\)\]\.\:\-\s])|$)/gis;
  const optionMap = new Map();
  let match;
  while ((match = optionRegex.exec(block)) !== null) {
    optionMap.set(match[1].toUpperCase(), match[2].trim());
  }
  return optionMap;
};

const resolveCorrectAnswer = (block, optionMap) => {
  const answerMatch = block.match(/(?:^|\n|\s)(?:answer|correct answer|ans)\s*[:\-]\s*([A-D]|.+)$/im);
  if (!answerMatch) return optionMap.get('A') || [...optionMap.values()][0] || '';

  const rawAnswer = answerMatch[1].trim();
  const letter = rawAnswer.toUpperCase().charAt(0);
  if (optionMap.has(letter)) return optionMap.get(letter);

  for (const value of optionMap.values()) {
    if (value.toLowerCase() === rawAnswer.toLowerCase()) return value;
  }
  return optionMap.get('A') || [...optionMap.values()][0] || '';
};

const normalizeQuestionFromAI = (q) => {
  if (!q || !q.questionText || !Array.isArray(q.options) || q.options.length !== 4) {
    return null;
  }

  const options = q.options.map((opt) => String(opt || '').trim());
  if (options.some((opt) => !opt)) return null;

  const rawAnswer = String(q.correctAnswer || '').trim();
  if (!rawAnswer) return null;

  let correctAnswer = rawAnswer;
  const letterMatch = rawAnswer.match(/^([A-D])(?:[\)\].:\-\s]|$)/i);
  if (letterMatch) {
    const idx = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
    correctAnswer = options[idx] || rawAnswer;
  } else {
    const exact = options.find((opt) => opt.toLowerCase() === rawAnswer.toLowerCase());
    if (exact) correctAnswer = exact;
  }

  if (!options.includes(correctAnswer)) return null;

  return {
    questionText: String(q.questionText).trim(),
    options,
    correctAnswer,
    explanation: String(q.explanation || '').trim(),
    difficulty: ['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : 'Medium',
    subject: String(q.subject || 'General').trim() || 'General',
    topic: String(q.topic || 'General').trim() || 'General',
  };
};

const fallbackExtractQuestions = (messages) => {
  const text = getTextFromMessages(messages);
  console.debug(`[aiService] Local Fallback started. Text length: ${text?.length || 0}`);
  
  if (!text || text.length < 15) return [];

  // Try to find blocks by digit starts or double line breaks
  let blocks = text
    .split(/(?=\n\s*\d+[\.\)\s])|\n\s*\n+/)
    .map((b) => b.trim())
    .filter((b) => b.length > 20);

  // If no blocks found by splitting, treat the whole text as one potentially large block
  if (blocks.length === 0 && text.length > 20) {
    blocks = [text.trim()];
  }

  const parsed = [];
  for (const block of blocks) {
    const optionMap = extractOptionMap(block);
    if (optionMap.size < 4) continue;

    // The question text is everything before the first option
    const firstOptionIdx = block.search(/(?:^|\s)[\(\[]?[A-D][\)\]\.\:\-\s]/i);
    const questionTextRaw = firstOptionIdx >= 0 ? block.slice(0, firstOptionIdx).trim() : block;
    const questionText = questionTextRaw
      .replace(/^\s*(?:Q(?:uestion)?\s*)?\d+[\)\].:\-]\s*/i, '')
      .trim();

    if (!questionText || questionText.length < 3) continue;

    const options = ['A', 'B', 'C', 'D'].map((k) => optionMap.get(k) || '').filter(Boolean);
    if (options.length !== 4) continue;

    let correctAnswer = resolveCorrectAnswer(block, optionMap);
    
    // PERMISSIVE: If no correct answer found in text, default to first option instead of failing
    if (!correctAnswer || !options.includes(correctAnswer)) {
      correctAnswer = options[0];
    }

    parsed.push({
      questionText,
      options,
      correctAnswer,
      explanation: 'Locally extracted (Safety Fallback).',
      difficulty: 'Medium',
      subject: 'General',
      topic: 'Extracted'
    });
  }

  console.info(`[aiService] Local Fallback extracted ${parsed.length} questions.`);
  return parsed;
};

const generateWithGemini = async (messages) => {
  const client = getGeminiClient();
  if (!client) return null;

  try {
    console.info('[aiService] Using Google Gemini fallback (Text)...');
    const model = client.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const userMessage = messages.find(m => m.role === 'user')?.content || '';
    const prompt = `You are a strict PDF question extractor. ONLY extract questions that already exist in the provided text. Do NOT generate, invent, or paraphrase any new questions. 
    
    Response format must be valid JSON:
    { "questions": [ { "questionText": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "...", "explanation": "...", "difficulty": "Medium", "subject": "General", "topic": "General" } ] }

    Text to extract from:
    ${userMessage}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (err) {
    console.error('[aiService] Gemini Text Error:', err.message);
    return null;
  }
};

const generateWithGroq = async (messages) => {
  const client = getGroqClient();
  if (!client) return null;

  try {
    console.info('[aiService] Using Groq fallback...');
    const response = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages,
      response_format: { type: 'json_object' },
      temperature: 0,
    });

    const raw = response.choices[0].message.content;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('[aiService] Groq Error:', err.message);
    return null;
  }
};

const generateWithGeminiVision = async (messages) => {
  const client = getGeminiClient();
  if (!client) return null;

  try {
    console.info('[aiService] Using Google Gemini fallback (Vision)...');
    const model = client.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    // In vision messages, content can be an array of parts
    const userMsg = messages.find(m => m.role === 'user');
    const parts = [];

    if (Array.isArray(userMsg.content)) {
      userMsg.content.forEach(part => {
        if (part.type === 'text') parts.push(part.text);
        if (part.type === 'image_url') {
          const base64 = part.image_url.url.split(',')[1];
          parts.push({
            inlineData: {
              data: base64,
              mimeType: 'image/jpeg'
            }
          });
        }
      });
    }

    const prompt = `You are a strict PDF question extractor. ONLY extract questions that already exist in the provided images. Do NOT generate or paraphrase. Try to identify options (A-D).
    
    Return JSON format: { "questions": [...] }`;

    const result = await model.generateContent([prompt, ...parts]);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (err) {
    console.error('[aiService] Gemini Vision Error:', err.message);
    return null;
  }
};

/**
 * Sends a structured prompt to AI and parses the JSON response.
 */
exports.generateQuestions = async (messages) => {
  let raw = '';
  const client = getOpenAIClient();

  // 1. Try OpenAI / OpenRouter first
  if (client) {
    try {
      const finalMessages = messages.some(m => m.role === 'system')
        ? messages
        : [
          {
            role: 'system',
            content: 'You are a strict PDF question extractor. ONLY extract questions that already exist in the provided text. Do NOT generate, invent, or paraphrase any new questions. If no MCQs exist in the text, return {"questions": []}.',
          },
          ...messages,
        ];

      const response = await client.chat.completions.create({
        model: resolvedModel,
        messages: finalMessages,
        response_format: { type: 'json_object' },
        temperature: 0,
        max_tokens: parseInt(process.env.AI_MAX_TOKENS) || 1500,
      });

      raw = response.choices[0].message.content;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed.questions.map(normalizeQuestionFromAI).filter(Boolean);
      }
    } catch (error) {
      console.error('[aiService] OpenAI Error:', error.message);
      // Only failover if it's a quota or server error
      if (error.status !== 429 && error.status !== 500) {
        throw error;
      }
    }
  }

  // 2. Try Groq (Fast Free AI)
  const groqResult = await generateWithGroq(messages);
  if (groqResult && Array.isArray(groqResult.questions) && groqResult.questions.length > 0) {
    return groqResult.questions.map(normalizeQuestionFromAI).filter(Boolean);
  }

  // 3. Try Gemini Fallback
  const geminiResult = await generateWithGemini(messages);
  if (geminiResult && Array.isArray(geminiResult.questions) && geminiResult.questions.length > 0) {
    return geminiResult.questions.map(normalizeQuestionFromAI).filter(Boolean);
  }

  // 4. Last Resort: Local RegEx Fallback
  const localFallback = fallbackExtractQuestions(messages);
  if (localFallback.length > 0) {
    console.warn('[aiService] All AI providers failed. Using local RegEx fallback.');
    return localFallback;
  }

  const errorMsg = `Extraction failed: All methods exhausted. (OpenAI: Quota/Error, Groq: ${getGroqClient() ? 'Failed' : 'No Key'}, Gemini: ${getGeminiClient() ? 'Failed' : 'No Key'}).`;
  throw new Error(errorMsg);
};

/**
 * Processes images using AI and extracts questions.
 */
exports.generateQuestionsFromVision = async (messages) => {
  const openAIClient = getOpenAIClient();
  
  // 1. Try OpenAI Vision
  if (openAIClient) {
    try {
      const response = await openAIClient.chat.completions.create({
        model: getVisionModel(),
        messages,
        response_format: { type: 'json_object' },
        max_tokens: parseInt(process.env.AI_MAX_TOKENS_VISION) || 1200,
      });

      const raw = response.choices[0].message.content;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed.questions.map(normalizeQuestionFromAI).filter(Boolean);
      }
    } catch (error) {
      console.error('[aiService] OpenAI Vision Error:', error.message);
    }
  }

  // 2. Try Gemini Vision Fallback
  const geminiResult = await generateWithGeminiVision(messages);
  if (geminiResult && Array.isArray(geminiResult.questions) && geminiResult.questions.length > 0) {
    return geminiResult.questions.map(normalizeQuestionFromAI).filter(Boolean);
  }

  return [];
};
