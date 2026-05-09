import React, { useState, useEffect } from 'react';

const QuestionDisplay = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelectOption,
  isQuizMode,
}) => {
  const [revealAnswer, setRevealAnswer] = useState(false);

  useEffect(() => {
    setRevealAnswer(false);
  }, [question._id]);

  const showInstantFeedback = isQuizMode && selectedAnswer && question.correctAnswer;
  const showRevealFromQuestionClick =
    isQuizMode && revealAnswer && question.correctAnswer && !selectedAnswer;
  const highlightCorrect =
    showInstantFeedback || showRevealFromQuestionClick;

  const handleQuestionClick = () => {
    if (!isQuizMode || !question.correctAnswer) return;
    setRevealAnswer((prev) => !prev);
  };

  return (
    <div
      className="stacked-card blue"
      style={{
        padding: '30px',
        backgroundColor: '#ffffff',
        marginBottom: '30px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <span style={{ fontWeight: '800', color: '#000', fontSize: '1.1rem' }}>
          QUESTION <span className="text-highlight">{questionIndex + 1}</span> / {totalQuestions}
        </span>
        <span
          style={{
            fontSize: '14px',
            padding: '4px 12px',
            backgroundColor: 'var(--bg-yellow)',
            border: '2px solid #000',
            borderRadius: '20px',
            fontWeight: '800',
            boxShadow: '3px 3px 0 #000',
          }}
        >
          {question.difficulty.toUpperCase()}
        </span>
      </div>

      <h3
        onClick={handleQuestionClick}
        title={isQuizMode ? 'Click to show or hide the correct answer' : undefined}
        style={{
          fontSize: '1.4rem',
          fontWeight: '800',
          lineHeight: '1.4',
          color: '#000',
          marginBottom: '25px',
          cursor: isQuizMode ? 'pointer' : 'default',
          userSelect: 'none',
        }}
      >
        {question.questionText}
        {isQuizMode && (
          <span
            style={{
              display: 'block',
              marginTop: '10px',
              fontSize: '0.75rem',
              fontWeight: 800,
              opacity: 0.65,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {revealAnswer && !selectedAnswer
              ? 'Answer revealed — pick an option to record your attempt'
              : 'Quiz: tap question to reveal answer, or tap an option'}
          </span>
        )}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {question.options.map((opt, idx) => {
          const isSelected = selectedAnswer === opt;
          const isCorrectOption = highlightCorrect && opt === question.correctAnswer;
          const isWrongSelected = showInstantFeedback && isSelected && opt !== question.correctAnswer;

          let backgroundColor = '#fff';
          if (isCorrectOption) backgroundColor = '#CFF7CF';
          if (isWrongSelected) backgroundColor = '#FFD5D5';

          return (
            <label
              key={idx}
              className={isSelected ? 'btn-yellow' : 'btn-ghost'}
              style={{
                padding: '16px 20px',
                border: '3px solid #000',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                backgroundColor,
                boxShadow: isSelected ? '6px 6px 0 #000' : '4px 4px 0 rgba(0,0,0,0.1)',
                transition: 'all 0.1s ease',
                transform: isSelected ? 'translate(-3px, -3px)' : 'none',
              }}
            >
              <input
                type="radio"
                name={`q_${question._id}`}
                value={opt}
                checked={isSelected}
                onChange={() => onSelectOption(opt)}
                style={{
                  marginRight: '20px',
                  width: '24px',
                  height: '24px',
                  accentColor: '#000',
                  cursor: 'pointer',
                }}
              />
              <span style={{ flex: 1, fontSize: '1.1rem', fontWeight: isSelected ? '800' : '600', color: '#000' }}>
                {opt}
              </span>
              {showInstantFeedback && isCorrectOption && (
                <span style={{ marginLeft: '10px', fontSize: '0.85rem', fontWeight: 900 }}>✅ Correct</span>
              )}
              {showInstantFeedback && isWrongSelected && (
                <span style={{ marginLeft: '10px', fontSize: '0.85rem', fontWeight: 900 }}>❌ Wrong</span>
              )}
              {showRevealFromQuestionClick && isCorrectOption && (
                <span style={{ marginLeft: '10px', fontSize: '0.85rem', fontWeight: 900 }}>✅ Answer</span>
              )}
            </label>
          );
        })}
      </div>

      {showInstantFeedback && (
        <div
          style={{
            marginTop: '16px',
            border: '2px solid #000',
            borderRadius: '10px',
            padding: '12px 14px',
            backgroundColor: selectedAnswer === question.correctAnswer ? '#CFF7CF' : '#FFD5D5',
            fontWeight: 800,
          }}
        >
          {selectedAnswer === question.correctAnswer
            ? 'Great! Your answer is correct.'
            : `Incorrect. Correct answer: ${question.correctAnswer}`}
        </div>
      )}

      {question.explanation && showInstantFeedback && selectedAnswer && (
        <div
          style={{
            marginTop: '12px',
            fontSize: '0.95rem',
            fontWeight: 600,
            opacity: 0.85,
            lineHeight: 1.5,
          }}
        >
          <strong>Why:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
