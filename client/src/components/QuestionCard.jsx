import React from 'react';

const QuestionCard = ({ question, index, onChange, onToggleApprove, onDelete, isReadOnly = false }) => {
  const handleChange = (field, value) => onChange(index, field, value);

  const handleOptionChange = (optIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optIndex] = value;
    onChange(index, 'options', newOptions);
  };

  const inputStyle = {
    width: '100%', padding: '8px', borderRadius: '6px',
    border: '2px solid #000', boxSizing: 'border-box',
    fontFamily: 'inherit', fontSize: '0.95rem'
  };

  return (
    <div className={`stacked-card ${question.approved ? 'yellow' : ''}`} style={{
      padding: '24px',
      marginBottom: '24px',
      backgroundColor: '#ffffff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Question {index + 1}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#000', 
            fontWeight: '800', 
            cursor: 'pointer',
            padding: '4px 12px',
            backgroundColor: question.approved ? 'var(--bg-green)' : 'var(--bg-beige)',
            border: '2px solid #000',
            borderRadius: '20px'
          }}>
            <input
              type="checkbox"
              checked={!!question.approved}
              disabled={isReadOnly}
              onChange={() => onToggleApprove(index)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            {question.approved ? 'Approved ✓' : 'Approve?'}
          </label>
          <button
            className="btn-danger"
            disabled={isReadOnly}
            onClick={() => onDelete(index)}
            style={{ padding: '6px 14px', fontSize: '0.9rem' }}
          >
            Delete
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#555', fontWeight: '600' }}>Question Text</label>
        <textarea
          value={question.questionText || ''}
          disabled={isReadOnly}
          onChange={(e) => handleChange('questionText', e.target.value)}
          style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', color: '#555', fontWeight: '600' }}>Options (select radio for Correct Answer)</label>
        {question.options && question.options.map((opt, oIndex) => (
          <div key={oIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <input
              type="radio"
              name={`correct_${index}`}
              disabled={isReadOnly}
              checked={question.correctAnswer === opt && opt !== ''}
              onChange={() => handleChange('correctAnswer', opt)}
              style={{ marginRight: '10px', width: '18px', height: '18px' }}
            />
            <input
              type="text"
              value={opt || ''}
              disabled={isReadOnly}
              onChange={(e) => handleOptionChange(oIndex, e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '2px solid #000' }}
              placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#777', marginBottom: '4px', fontWeight: '600' }}>Difficulty</label>
          <select
            value={question.difficulty || 'Medium'}
            disabled={isReadOnly}
            onChange={(e) => handleChange('difficulty', e.target.value)}
            style={inputStyle}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#777', marginBottom: '4px', fontWeight: '600' }}>Subject</label>
          <input
            type="text"
            value={question.subject || ''}
            disabled={isReadOnly}
            onChange={(e) => handleChange('subject', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#777', marginBottom: '4px', fontWeight: '600' }}>Topic</label>
          <input
            type="text"
            value={question.topic || ''}
            disabled={isReadOnly}
            onChange={(e) => handleChange('topic', e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
