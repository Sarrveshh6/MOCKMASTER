const Question = require('../models/Question');

exports.saveQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'No questions provided' });
    }

    // Attach user ID to each question
    const questionsToSave = questions.map(q => ({
      ...q,
      userId: req.user.id
    }));

    const saved = await Question.insertMany(questionsToSave);

    res.status(201).json({
      success: true,
      count: saved.length,
      message: 'Questions saved successfully'
    });
  } catch (error) {
    console.error('Save Questions Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const { subject, difficulty, source } = req.query;
    
    // Build query
    let query = {};
    
    if (source === 'bank') {
      query.isBankQuestion = true;
    } else {
      query.userId = req.user.id;
      query.isBankQuestion = false;
    }

    if (subject) query.subject = subject;
    if (difficulty) query.difficulty = difficulty;

    const questions = await Question.find(query)
      .populate('documentId', 'originalName uploadedAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Get Questions Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadToBank = async (req, res) => {
  try {
    const { questions } = req.body;
    
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'No questions provided' });
    }

    const questionsToSave = questions.map(q => ({
      ...q,
      userId: req.user.id,
      isBankQuestion: true
    }));

    const saved = await Question.insertMany(questionsToSave);

    res.status(201).json({
      success: true,
      count: saved.length,
      message: 'Questions uploaded to Bank successfully'
    });
  } catch (error) {
    console.error('Bank Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Auth check: Owner OR Admin (if it's a bank question)
    const isOwner = question.userId.toString() === req.user.id;
    const isAdminDeletingBank = req.user.role === 'admin' && question.isBankQuestion;

    if (!isOwner && !isAdminDeletingBank) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this question' });
    }

    await question.deleteOne();

    res.status(200).json({ success: true, message: 'Question removed' });
  } catch (error) {
    console.error('Delete Question Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
