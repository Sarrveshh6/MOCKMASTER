const TestAttempt = require('../models/TestAttempt');
const Result = require('../models/Result');
const Question = require('../models/Question');
const testService = require('../services/testService');
const mongoose = require('mongoose');

exports.generateTest = async (req, res) => {
  try {
    const { subject = 'All', topic = 'All', difficulty = 'Mixed', count = 10, duration = 15, mode = 'Test', source = 'user' } = req.query;
    
    const questions = await testService.generateTest(req.user.id, count, subject, difficulty, topic, source);
    
    const attempt = new TestAttempt({
      userId: req.user.id,
      subject,
      difficulty,
      mode,
      duration: parseInt(duration, 10),
      questions: questions.map(q => q._id)
    });
    
    await attempt.save();

    // In Quiz mode we keep correctAnswer for instant feedback.
    // In Test mode we strip it to prevent cheating.
    const sanitizedQuestions = mode === 'Quiz'
      ? questions
      : questions.map(q => {
          const { correctAnswer, ...rest } = q;
          return rest;
        });

    res.status(200).json({
      success: true,
      attemptId: attempt._id,
      duration: attempt.duration,
      mode: attempt.mode,
      questions: sanitizedQuestions
    });
  } catch (error) {
    console.error('Generate Test Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.generateTestByDocument = async (req, res) => {
  try {
    const {
      documentId,
      count,
      duration,
      mode = 'Test',
      difficulty = 'Mixed',
      source = 'user'
    } = req.body;

    if (!documentId || !mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ success: false, message: 'Valid documentId is required.' });
    }

    const matchStage = {
      documentId: new mongoose.Types.ObjectId(documentId)
    };

    if (source === 'bank') {
      matchStage.isBankQuestion = true;
    } else {
      matchStage.userId = new mongoose.Types.ObjectId(req.user.id);
      matchStage.isBankQuestion = false;
    }

    if (difficulty && difficulty !== 'Mixed' && difficulty !== 'All') {
      matchStage.difficulty = difficulty;
    }

    const totalAvailable = await Question.countDocuments(matchStage);
    if (totalAvailable === 0) {
      return res.status(404).json({ success: false, message: 'No questions found for this PDF group.' });
    }

    const requestedCount = parseInt(count, 10);
    const finalCount = Number.isFinite(requestedCount) && requestedCount > 0
      ? Math.min(requestedCount, totalAvailable)
      : totalAvailable;

    const questions = await Question.aggregate([
      { $match: matchStage },
      { $sample: { size: finalCount } }
    ]);

    const finalDuration = parseInt(duration, 10) > 0
      ? parseInt(duration, 10)
      : Math.max(10, Math.ceil(finalCount * 1.5));

    const attempt = new TestAttempt({
      userId: req.user.id,
      subject: 'PDF Group',
      difficulty: difficulty || 'Mixed',
      mode,
      duration: finalDuration,
      questions: questions.map((q) => q._id)
    });
    await attempt.save();

    const sanitizedQuestions = mode === 'Quiz'
      ? questions
      : questions.map((q) => {
          const { correctAnswer, ...rest } = q;
          return rest;
        });

    res.status(200).json({
      success: true,
      attemptId: attempt._id,
      duration: attempt.duration,
      mode: attempt.mode,
      questions: sanitizedQuestions
    });
  } catch (error) {
    console.error('Generate PDF Group Test Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { attemptId, answers, timeTaken } = req.body;
    
    const attempt = await TestAttempt.findById(attemptId);
    if (!attempt || attempt.userId.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Test attempt not found' });
    }

    const questions = await Question.find({ _id: { $in: attempt.questions } });
    
    const evaluation = testService.evaluateTest(questions, answers);

    const result = new Result({
      userId: req.user.id,
      attemptId,
      totalQuestions: questions.length,
      correct: evaluation.correct,
      incorrect: evaluation.incorrect,
      skipped: evaluation.skipped,
      score: evaluation.score,
      accuracy: evaluation.accuracy,
      timeTaken,
      questionWiseResult: evaluation.questionWiseResult,
      topicWiseBreakdown: evaluation.topicWiseBreakdown
    });

    await result.save();

    res.status(200).json({
      success: true,
      resultId: result._id
    });
  } catch (error) {
    console.error('Submit Test Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('attemptId')
      .populate('questionWiseResult.questionId');

    if (!result || result.userId.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Result not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Get Result Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Translate Questions ────────────────────────────────────────────────────
exports.translateQuestions = async (req, res) => {
  const { questions, language } = req.body;
  if (!questions || !language || language === 'English') {
    return res.status(200).json({ success: true, questions });
  }

  const { OpenAI } = require('openai');
  const key = (process.env.OPENAI_API_KEY || '').trim();
  if (!key) return res.status(200).json({ success: true, questions });

  try {
    const isOpenRouter = key.startsWith('sk-or-v1-');
    const client = new OpenAI({
      apiKey: key,
      ...(isOpenRouter ? { baseURL: 'https://openrouter.ai/api/v1' } : {}),
    });
    const model = isOpenRouter
      ? (process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini')
      : 'gpt-4o-mini';

    // Keep only the fields we need to stay within token limits
    const slim = questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
    }));

    const systemPrompt = `You are a professional exam translator. Translate ONLY the text fields (questionText, options array items, correctAnswer, explanation) into ${language}. Do NOT change any _id fields. Return a JSON object with a "questions" array matching the exact same structure.`;

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: JSON.stringify({ questions: slim }) },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 4000,
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    if (!Array.isArray(parsed.questions)) throw new Error('Bad AI response');

    // Merge translations back into the original question docs (preserve all extra fields)
    const translated = questions.map((orig, i) => ({
      ...orig,
      questionText: parsed.questions[i]?.questionText || orig.questionText,
      options:      parsed.questions[i]?.options      || orig.options,
      correctAnswer: parsed.questions[i]?.correctAnswer || orig.correctAnswer,
      explanation:  parsed.questions[i]?.explanation  || orig.explanation,
    }));

    return res.status(200).json({ success: true, questions: translated });
  } catch (err) {
    console.error('[translateQuestions] Error:', err.message);
    return res.status(200).json({ success: true, questions }); // graceful fallback
  }
};

