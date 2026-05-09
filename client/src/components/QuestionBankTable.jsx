import React from 'react';

const QuestionBankTable = ({ questions, onDelete }) => {
  if (!questions || questions.length === 0) {
    return <p style={{ color: '#666' }}>No questions found in your bank.</p>;
  }

  const difficultyStyle = (difficulty) => {
    let bgColor = 'var(--bg-green)';
    if (difficulty === 'Medium') bgColor = 'var(--bg-yellow)';
    if (difficulty === 'Hard') bgColor = '#ff5c5c';

    return {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '800',
      border: '2px solid #000',
      backgroundColor: bgColor,
      color: '#000',
      boxShadow: '2px 2px 0 #000',
      display: 'inline-block',
      textTransform: 'uppercase'
    };
  };

  return (
    <div style={{ overflowX: 'auto', backgroundColor: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: 'var(--bg-yellow)', borderBottom: '3px solid #000' }}>
          <tr>
            <th style={{ padding: '15px 20px', color: '#000', fontWeight: '900', borderRight: '2px solid #000' }}>QUESTION</th>
            <th style={{ padding: '15px 20px', color: '#000', fontWeight: '900', borderRight: '2px solid #000' }}>TOPIC</th>
            <th style={{ padding: '15px 20px', color: '#000', fontWeight: '900', borderRight: '2px solid #000' }}>DIFFICULTY</th>
            <th style={{ padding: '15px 20px', color: '#000', fontWeight: '900', borderRight: '2px solid #000' }}>ADDED</th>
            <th style={{ padding: '15px 20px', color: '#000', fontWeight: '900' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q._id} style={{ borderBottom: '3px solid #000' }}>
              <td style={{ padding: '15px 20px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderRight: '2px solid #000' }} title={q.questionText}>
                {q.questionText}
              </td>
              <td style={{ padding: '15px 20px', borderRight: '2px solid #000' }}>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#666', textTransform: 'uppercase' }}>{q.subject}</span>
                <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{q.topic}</span>
              </td>
              <td style={{ padding: '15px 20px', borderRight: '2px solid #000' }}>
                <span style={difficultyStyle(q.difficulty)}>{q.difficulty}</span>
              </td>
              <td style={{ padding: '15px 20px', fontSize: '13px', fontWeight: '700', color: '#555', borderRight: '2px solid #000' }}>
                {new Date(q.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td style={{ padding: '15px 20px' }}>
                <button
                  className="btn-danger"
                  onClick={() => onDelete(q._id)}
                  style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 900 }}
                >
                  DELETE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBankTable;
