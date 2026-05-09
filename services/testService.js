const Question = require('../models/Question');
const mongoose = require('mongoose');

exports.generateTest = async (userId, count, subject, difficulty, topic, source = 'user') => {
  let matchStage = {};

  if (source === 'bank') {
    matchStage.isBankQuestion = true;
  } else {
    matchStage.userId = new mongoose.Types.ObjectId(userId);
    matchStage.isBankQuestion = false;
  }
  
  if (subject && subject !== 'Mixed' && subject !== 'All') {
    matchStage.subject = subject;
  }

  if (topic && topic !== 'All') {
    matchStage.topic = topic;
  }
  
  if (difficulty && difficulty !== 'Mixed' && difficulty !== 'All') {
    matchStage.difficulty = difficulty;
  }

  // Check if database is connected
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database is currently disconnected. Please check your MongoDB Atlas connection.');
  }

  const pipeline = [
    { $match: matchStage },
    { $sample: { size: parseInt(count, 10) } }
  ];

  const questions = await Question.aggregate(pipeline);
  
  if (questions.length === 0) {
     throw new Error(`Your Question Bank is currently empty for the selected criteria (${subject} - ${topic}). Please upload a PDF first!`);
  }

  if (questions.length < parseInt(count, 10)) {
     console.warn(`[testService] Requested ${count} questions, but only ${questions.length} available.`);
  }

  return questions;
};

exports.evaluateTest = (questions, userAnswers) => {
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;
  const questionWiseResult = [];
  const topicMap = {};

  questions.forEach(q => {
    const answerObj = userAnswers.find(a => a.questionId === q._id.toString());
    const userAnswer = answerObj ? answerObj.answer : null;
    
    let isCorrect = false;
    let isSkipped = false;

    if (!userAnswer || userAnswer.trim() === '') {
      skipped++;
      isSkipped = true;
    } else if (userAnswer === q.correctAnswer) {
      correct++;
      isCorrect = true;
    } else {
      incorrect++;
    }

    questionWiseResult.push({
      questionId: q._id,
      userAnswer,
      isCorrect,
      isSkipped
    });

    const topic = q.topic || 'General';
    if (!topicMap[topic]) {
      topicMap[topic] = { totalAttempted: 0, correct: 0 };
    }
    
    if (!isSkipped) {
      topicMap[topic].totalAttempted++;
      if (isCorrect) topicMap[topic].correct++;
    }
  });

  const total = questions.length;
  const score = correct; // 1 mark per correct
  const accuracy = total > 0 ? (correct / total) * 100 : 0;

  const topicWiseBreakdown = Object.keys(topicMap).map(topic => {
    const stats = topicMap[topic];
    return {
      topic,
      totalAttempted: stats.totalAttempted,
      correct: stats.correct,
      accuracy: stats.totalAttempted > 0 ? (stats.correct / stats.totalAttempted) * 100 : 0
    };
  });

  return { correct, incorrect, skipped, score, accuracy, questionWiseResult, topicWiseBreakdown };
};
