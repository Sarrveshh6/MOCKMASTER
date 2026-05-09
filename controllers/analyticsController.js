const Result = require('../models/Result');

exports.getSummary = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id }).sort({ completedAt: 1 });

    let totalTests = results.length;
    let highestScore = 0;
    let totalQuestionsAttempted = 0;
    let sumAccuracy = 0;

    const trendData = [];

    results.forEach((r, idx) => {
      if (r.score > highestScore) highestScore = r.score;
      totalQuestionsAttempted += r.totalQuestions;
      sumAccuracy += r.accuracy;

      // Only push the last 10 attempts for the trend chart
      if (results.length - idx <= 10) {
        trendData.push({
          attemptNo: `Test ${idx + 1}`,
          accuracy: r.accuracy,
          date: new Date(r.completedAt).toLocaleDateString()
        });
      }
    });

    const averageAccuracy = totalTests > 0 ? (sumAccuracy / totalTests) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalTests,
        averageAccuracy,
        highestScore,
        totalQuestionsAttempted,
        trendData
      }
    });
  } catch (error) {
    console.error('Analytics Summary Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTopics = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id });

    const topicStats = {};

    results.forEach(r => {
      r.topicWiseBreakdown.forEach(topicData => {
        const { topic, totalAttempted, correct } = topicData;
        if (!topicStats[topic]) {
          topicStats[topic] = { totalAttempted: 0, correct: 0 };
        }
        topicStats[topic].totalAttempted += totalAttempted;
        topicStats[topic].correct += correct;
      });
    });

    const aggregatedTopics = Object.keys(topicStats).map(topic => {
      const stats = topicStats[topic];
      const accuracy = stats.totalAttempted > 0 ? (stats.correct / stats.totalAttempted) * 100 : 0;
      return {
        topic,
        totalAttempted: stats.totalAttempted,
        correct: stats.correct,
        accuracy,
        isWeak: accuracy < 50
      };
    });

    // Sort by weakness first, then ascending accuracy
    aggregatedTopics.sort((a, b) => a.accuracy - b.accuracy);

    res.status(200).json({
      success: true,
      data: aggregatedTopics
    });
  } catch (error) {
    console.error('Analytics Topics Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id })
      .populate('attemptId')
      .sort({ completedAt: -1 });

    const formattedHistory = results.map(r => ({
      _id: r._id,
      date: r.completedAt,
      subject: r.attemptId?.subject || 'N/A',
      mode: r.attemptId?.mode || 'N/A',
      score: r.score,
      totalQuestions: r.totalQuestions,
      accuracy: r.accuracy,
      duration: r.attemptId?.duration || 0
    }));

    res.status(200).json({
      success: true,
      data: formattedHistory
    });
  } catch (error) {
    console.error('Analytics History Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
