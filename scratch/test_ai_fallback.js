require('dotenv').config();
const aiService = require('../services/aiService');

async function testFallback() {
    console.log('--- Testing AI Fallback Logic ---');
    console.log('Targeting OpenAI first (with current quota error)...');

    const mockMessages = [
        { role: 'user', content: 'Extract all MCQ questions from the following text: --- 1. What is 2+2? A) 3 B) 4 C) 5 D) 6 Correct Answer: B ---' }
    ];

    try {
        console.info('Calling aiService.generateQuestions...');
        const questions = await aiService.generateQuestions(mockMessages);
        console.log('Success! Extracted Questions:', JSON.stringify(questions, null, 2));
    } catch (err) {
        console.error('Final Error Failure:', err.message);
    }
}

testFallback();
