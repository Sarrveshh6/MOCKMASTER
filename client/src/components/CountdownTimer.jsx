import React, { useState, useEffect, useRef } from 'react';

const CountdownTimer = ({ durationMinutes, onTimeout, active = true }) => {
  const totalSeconds = Math.max(1, Math.floor(Number(durationMinutes) * 60));
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    setTimeLeft(totalSeconds);
  }, [totalSeconds, active]);

  useEffect(() => {
    if (!active) return;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        if (prev === 1) {
          onTimeoutRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [active, totalSeconds]);

  if (!active) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return (
      <div
        style={{
          padding: '8px 16px',
          backgroundColor: '#e8e8e8',
          color: '#444',
          borderRadius: '8px',
          fontWeight: '900',
          fontSize: '16px',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4px',
          border: '3px solid #000',
          boxShadow: '4px 4px 0px #000',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Timer starts after first answer
        </span>
        <span>
          <span style={{ marginRight: '8px' }}>⏱</span>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  const minutes = Math.floor(Math.max(0, timeLeft) / 60);
  const seconds = Math.max(0, timeLeft) % 60;

  return (
    <div
      style={{
        padding: '8px 16px',
        backgroundColor: timeLeft < 60 ? '#ff5c5c' : 'var(--bg-yellow)',
        color: '#000',
        borderRadius: '8px',
        fontWeight: '900',
        fontSize: '20px',
        display: 'inline-block',
        border: '3px solid #000',
        boxShadow: '4px 4px 0px #000',
      }}
    >
      <span style={{ marginRight: '8px' }}>⏱</span>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

export default CountdownTimer;
