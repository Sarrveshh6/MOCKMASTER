import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

// ─── Status colours (NTA / JEE style) ────────────────────────────────────────
const STATUS = {
  NOT_VISITED:     { bg: '#808080', color: '#fff' },
  NOT_ANSWERED:    { bg: '#c0392b', color: '#fff' },
  ANSWERED:        { bg: '#27ae60', color: '#fff' },
  MARKED:          { bg: '#8e44ad', color: '#fff' },
  ANSWERED_MARKED: { bg: '#8e44ad', color: '#fff', dot: '#27ae60' },
};

const LANGUAGES = ['English', 'Hindi'];

// ─── Bilingual content ────────────────────────────────────────────────────────
const CONTENT = {
  English: {
    title: 'Mock Test',
    readCarefully: 'Please read the instructions carefully',
    testInsHeading: 'Test Instructions:',
    genInsHeading: 'General Instructions:',
    navHeading: 'Navigating to a Question:',
    ansHeading: 'Answering a Question:',
    ti1: (m) => <>Total duration of this test is <strong>{m} mins</strong>.</>,
    ti2: 'It consists of 1 section.',
    ti3: (t, mk) => <>The test consists of <strong>{t} questions</strong>. The maximum mark is <strong>{mk}</strong>.</>,
    ti4: 'There is only one correct response for each objective-type question.',
    ti5: <>Each correct answer gives <strong>4 marks</strong> while <strong>1 mark is deducted</strong> for a wrong response. No negative marking for unattempted questions.</>,
    ti6: <>The countdown timer <span style={{ background: '#ff0', padding: '0 3px' }}>in the top left corner</span> displays remaining time. When it reaches zero, the exam ends automatically.</>,
    gi1: 'The Question Palette on the right shows status of each question:',
    gi2: <>Click <strong>"View Instructions"</strong> during the exam to re-read these instructions.</>,
    nav1: 'To answer a question:',
    nav1a: 'Click a question number in the palette to jump to it directly.',
    nav1b: <><strong>Save &amp; Next</strong> — saves your answer and moves to the next question.</>,
    nav1c: <><strong>Mark for Review &amp; Next</strong> — saves, flags for review, and moves to the next question.</>,
    ans1: 'For multiple choice questions:',
    ans1a: 'Click an option button to select your answer.',
    ans1b: <>Click the same option again or press <strong>Clear</strong> to deselect.</>,
    ans1c: 'Click a different option to change your answer.',
    ans1d: <>You MUST click <strong>Save &amp; Next</strong> to record your answer.</>,
    ans1e: <>Click <strong>Mark for Review &amp; Next</strong> to flag the question for later.</>,
    langNote: (l) => <>All questions will appear in <strong>{l}</strong>.</>,
    declaration: 'I have read and understood the instructions. I declare that I am not in possession of any prohibited device. I agree that any violation may result in disqualification.',
    tableHeading: 'Marking Scheme',
    tableHeaders: ['Section', 'Type', 'Questions', '+Marks', '-Marks', 'Total'],
    startBtn: 'Start Test \u25b6',
    translatingBtn: 'Translating...',
    langLabel: 'Language',
    qLabel: 'Questions',
    mLabel: 'Marks',
    minLabel: 'min',
    statusLabels: {
      NOT_VISITED: 'Not Visited',
      NOT_ANSWERED: 'Not Answered',
      ANSWERED: 'Answered',
      MARKED: 'Marked for Review',
      ANSWERED_MARKED: 'Answered & Marked for Review',
    },
  },
  Hindi: {
    title: '\u092e\u0949\u0915 \u091f\u0947\u0938\u094d\u091f',
    readCarefully: '\u0915\u0943\u092a\u092f\u093e \u0928\u093f\u0930\u094d\u0926\u0947\u0936\u094b\u0902 \u0915\u094b \u0927\u094d\u092f\u093e\u0928 \u0938\u0947 \u092a\u0922\u093c\u0947\u0902',
    testInsHeading: '\u092a\u0930\u0940\u0915\u094d\u0937\u093e \u0928\u093f\u0930\u094d\u0926\u0947\u0936:',
    genInsHeading: '\u0938\u093e\u092e\u093e\u0928\u094d\u092f \u0928\u093f\u0930\u094d\u0926\u0947\u0936:',
    navHeading: '\u092a\u094d\u0930\u0936\u094d\u0928 \u092a\u0930 \u091c\u093e\u0928\u093e:',
    ansHeading: '\u092a\u094d\u0930\u0936\u094d\u0928 \u0915\u093e \u0909\u0924\u094d\u0924\u0930 \u0926\u0947\u0928\u093e:',
    ti1: (m) => <>\u0907\u0938 \u092a\u0930\u0940\u0915\u094d\u0937\u093e \u0915\u0940 \u0915\u0941\u0932 \u0905\u0935\u0927\u093f <strong>{m} \u092e\u093f\u0928\u091f</strong> \u0939\u0948\u0964</>,
    ti2: '\u0907\u0938\u092e\u0947\u0902 1 \u0916\u0902\u0921 \u0939\u0948\u0964',
    ti3: (t, mk) => <>\u092a\u0930\u0940\u0915\u094d\u0937\u093e \u092e\u0947\u0902 <strong>{t} \u092a\u094d\u0930\u0936\u094d\u0928</strong> \u0939\u0948\u0902\u0964 \u0905\u0927\u093f\u0915\u0924\u092e \u0905\u0902\u0915 <strong>{mk}</strong> \u0939\u0948\u0902\u0964</>,
    ti4: '\u092a\u094d\u0930\u0924\u094d\u092f\u0947\u0915 \u092a\u094d\u0930\u0936\u094d\u0928 \u0915\u093e \u0915\u0947\u0935\u0932 \u090f\u0915 \u0938\u0939\u0940 \u0909\u0924\u094d\u0924\u0930 \u0939\u0948\u0964',
    ti5: <>\u0938\u0939\u0940 \u0909\u0924\u094d\u0924\u0930 \u092a\u0930 <strong>4 \u0905\u0902\u0915</strong>, \u0917\u0932\u0924 \u0909\u0924\u094d\u0924\u0930 \u092a\u0930 <strong>1 \u0905\u0902\u0915 \u0915\u0924\u0930\u093e</strong>\u0964 \u0905\u0928\u0941\u0924\u094d\u0924\u0930\u093f\u0924 \u092a\u0930 \u0915\u094b\u0908 \u0928\u0915\u093e\u0930\u093e\u0924\u094d\u092e\u0915 \u0905\u0902\u0915\u0928 \u0928\u0939\u0940\u0902\u0964</>,
    ti6: <>\u0938\u094d\u0915\u094d\u0930\u0940\u0928 \u0915\u0947 <span style={{ background: '#ff0', padding: '0 3px' }}>\u090a\u092a\u0930\u0940 \u092c\u093e\u090f\u0902 \u0915\u094b\u0928\u0947</span> \u092e\u0947\u0902 \u0915\u093e\u0909\u0902\u091f\u0921\u093e\u0909\u0928 \u091f\u093e\u0907\u092e\u0930 \u0936\u0947\u0937 \u0938\u092e\u092f \u0926\u093f\u0916\u093e\u090f\u0917\u093e\u0964 \u0936\u0942\u0928\u094d\u092f \u0939\u094b\u0928\u0947 \u092a\u0930 \u092a\u0930\u0940\u0915\u094d\u0937\u093e \u0938\u094d\u0935\u0924\u0903 \u0938\u092e\u093e\u092a\u094d\u0924 \u0939\u094b\u0917\u0940\u0964</>,
    gi1: '\u0926\u093e\u0908\u0902 \u0913\u0930 \u092a\u094d\u0930\u0936\u094d\u0928 \u092a\u0948\u0932\u0947\u091f \u092a\u094d\u0930\u0924\u094d\u092f\u0947\u0915 \u092a\u094d\u0930\u0936\u094d\u0928 \u0915\u0940 \u0938\u094d\u0925\u093f\u0924\u093f \u0928\u093f\u092e\u094d\u0928 \u0930\u0902\u0917\u094b\u0902 \u0938\u0947 \u0926\u093f\u0916\u093e\u0924\u093e \u0939\u0948:',
    gi2: <>\u092a\u0930\u0940\u0915\u094d\u0937\u093e \u0915\u0947 \u0926\u094c\u0930\u093e\u0928 \u0928\u093f\u0930\u094d\u0926\u0947\u0936 \u092a\u0941\u0928\u0903 \u092a\u0922\u093c\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f <strong>"\u0928\u093f\u0930\u094d\u0926\u0947\u0936 \u0926\u0947\u0916\u0947\u0902"</strong> \u092c\u091f\u0928 \u0926\u092c\u093e\u090f\u0902\u0964</>,
    nav1: '\u092a\u094d\u0930\u0936\u094d\u0928 \u0915\u093e \u0909\u0924\u094d\u0924\u0930 \u0926\u0947\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f:',
    nav1a: '\u0915\u093f\u0938\u0940 \u092d\u0940 \u092a\u094d\u0930\u0936\u094d\u0928 \u092a\u0930 \u0938\u0940\u0927\u0947 \u091c\u093e\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u092a\u0948\u0932\u0947\u091f \u092e\u0947\u0902 \u0909\u0938 \u0928\u0902\u092c\u0930 \u092a\u0930 \u0915\u094d\u0932\u093f\u0915 \u0915\u0930\u0947\u0902\u0964',
    nav1b: <><strong>\u0938\u0939\u0947\u091c\u0947\u0902 \u0914\u0930 \u0905\u0917\u0932\u093e</strong> \u2014 \u0909\u0924\u094d\u0924\u0930 \u0938\u0939\u0947\u091c\u0924\u093e \u0939\u0948 \u0914\u0930 \u0905\u0917\u0932\u0947 \u092a\u094d\u0930\u0936\u094d\u0928 \u092a\u0930 \u091c\u093e\u0924\u093e \u0939\u0948\u0964</>,
    nav1c: <><strong>\u0938\u092e\u0940\u0915\u094d\u0937\u093e \u0935 \u0905\u0917\u0932\u093e</strong> \u2014 \u0909\u0924\u094d\u0924\u0930 \u0938\u0939\u0947\u091c\u0924\u093e \u0939\u0948, \u091a\u093f\u0939\u094d\u0928\u093f\u0924 \u0915\u0930\u0924\u093e \u0939\u0948 \u0914\u0930 \u0905\u0917\u0932\u0947 \u092a\u0930 \u091c\u093e\u0924\u093e \u0939\u0948\u0964</>,
    ans1: '\u092c\u0939\u0941\u0935\u093f\u0915\u0932\u094d\u092a\u0940\u092f \u092a\u094d\u0930\u0936\u094d\u0928 \u0915\u0947 \u0932\u093f\u090f:',
    ans1a: '\u0909\u0924\u094d\u0924\u0930 \u091a\u0941\u0928\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0935\u093f\u0915\u0932\u094d\u092a \u092a\u0930 \u0915\u094d\u0932\u093f\u0915 \u0915\u0930\u0947\u0902\u0964',
    ans1b: <>\u091a\u0941\u0928\u0947 \u0939\u0941\u090f \u0935\u093f\u0915\u0932\u094d\u092a \u092a\u0930 \u092a\u0941\u0928\u0903 \u0915\u094d\u0932\u093f\u0915 \u0915\u0930\u0947\u0902 \u092f\u093e <strong>\u0938\u093e\u092b\u093c \u0915\u0930\u0947\u0902</strong> \u0926\u092c\u093e\u090f\u0902\u0964</>,
    ans1c: '\u0909\u0924\u094d\u0924\u0930 \u092c\u0926\u0932\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0915\u094b\u0908 \u0905\u0928\u094d\u092f \u0935\u093f\u0915\u0932\u094d\u092a \u091a\u0941\u0928\u0947\u0902\u0964',
    ans1d: <>\u0909\u0924\u094d\u0924\u0930 \u0938\u0939\u0947\u091c\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f <strong>\u0938\u0939\u0947\u091c\u0947\u0902 \u0914\u0930 \u0905\u0917\u0932\u093e</strong> \u0905\u0935\u0936\u094d\u092f \u0926\u092c\u093e\u090f\u0902\u0964</>,
    ans1e: <><strong>\u0938\u092e\u0940\u0915\u094d\u0937\u093e \u0935 \u0905\u0917\u0932\u093e</strong> \u0926\u092c\u093e\u0915\u0930 \u092a\u094d\u0930\u0936\u094d\u0928 \u0915\u094b \u092c\u093e\u0926 \u092e\u0947\u0902 \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u091a\u093f\u0939\u094d\u0928\u093f\u0924 \u0915\u0930\u0947\u0902\u0964</>,
    langNote: (l) => <>\u0938\u092d\u0940 \u092a\u094d\u0930\u0936\u094d\u0928 <strong>{l === 'Hindi' ? '\u0939\u093f\u0902\u0926\u0940' : l}</strong> \u092e\u0947\u0902 \u0926\u093f\u0916\u0947\u0902\u0917\u0947\u0964</>,
    declaration: '\u092e\u0948\u0902\u0928\u0947 \u0928\u093f\u0930\u094d\u0926\u0947\u0936\u094b\u0902 \u0915\u094b \u092a\u0922\u093c \u0914\u0930 \u0938\u092e\u091d \u0932\u093f\u092f\u093e \u0939\u0948\u0964 \u092e\u0948\u0902 \u0918\u094b\u0937\u0923\u093e \u0915\u0930\u0924\u093e/\u0915\u0930\u0924\u0940 \u0939\u0942\u0901 \u0915\u093f \u092e\u0947\u0930\u0947 \u092a\u093e\u0938 \u0915\u094b\u0908 \u092d\u0940 \u092a\u094d\u0930\u0924\u093f\u092c\u0902\u0927\u093f\u0924 \u0909\u092a\u0915\u0930\u0923 \u0928\u0939\u0940\u0902 \u0939\u0948\u0964 \u0928\u093f\u0930\u094d\u0926\u0947\u0936\u094b\u0902 \u0915\u093e \u0909\u0932\u094d\u0932\u0902\u0918\u0928 \u0915\u0930\u0928\u0947 \u092a\u0930 \u092e\u0941\u091d\u0947 \u0905\u092f\u094b\u0917\u094d\u092f \u0918\u094b\u0937\u093f\u0924 \u0915\u093f\u092f\u093e \u091c\u093e \u0938\u0915\u0924\u093e \u0939\u0948\u0964',
    tableHeading: '\u0905\u0902\u0915\u0928 \u092f\u094b\u091c\u0928\u093e',
    tableHeaders: ['\u0916\u0902\u0921', '\u092a\u094d\u0930\u0915\u093e\u0930', '\u092a\u094d\u0930\u0936\u094d\u0928', '+\u0905\u0902\u0915', '-\u0905\u0902\u0915', '\u0915\u0941\u0932'],
    startBtn: '\u092a\u0930\u0940\u0915\u094d\u0937\u093e \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902 \u25b6',
    translatingBtn: '\u0905\u0928\u0941\u0935\u093e\u0926 \u0939\u094b \u0930\u0939\u093e \u0939\u0948...',
    langLabel: '\u092d\u093e\u0937\u093e',
    qLabel: '\u092a\u094d\u0930\u0936\u094d\u0928',
    mLabel: '\u0905\u0902\u0915',
    minLabel: '\u092e\u093f\u0928\u091f',
    statusLabels: {
      NOT_VISITED: '\u0928\u0939\u0940\u0902 \u0926\u0947\u0916\u093e',
      NOT_ANSWERED: '\u0909\u0924\u094d\u0924\u0930 \u0928\u0939\u0940\u0902 \u0926\u093f\u092f\u093e',
      ANSWERED: '\u0909\u0924\u094d\u0924\u0930 \u0926\u093f\u092f\u093e',
      MARKED: '\u0938\u092e\u0940\u0915\u094d\u0937\u093e \u0915\u0947 \u0932\u093f\u090f \u091a\u093f\u0939\u094d\u0928\u093f\u0924',
      ANSWERED_MARKED: '\u0909\u0924\u094d\u0924\u0930 \u0926\u093f\u092f\u093e \u0914\u0930 \u091a\u093f\u0939\u094d\u0928\u093f\u0924',
    },
  },
};

// ─── Derive palette status ────────────────────────────────────────────────────
const getQStatus = (idx, answers, visited, marked) => {
  const answered = answers[idx] !== undefined;
  const isMarked = marked.has(idx);
  const isVisited = visited.has(idx);
  if (answered && isMarked) return 'ANSWERED_MARKED';
  if (isMarked) return 'MARKED';
  if (answered) return 'ANSWERED';
  if (isVisited) return 'NOT_ANSWERED';
  return 'NOT_VISITED';
};

// ─── Instructions Screen ──────────────────────────────────────────────────────
const InstructionsScreen = ({ testData, onStart }) => {
  const [language, setLanguage] = useState('English');
  const [translating, setTranslating] = useState(false);
  const t = CONTENT[language] || CONTENT.English;

  const total = testData.questions.length;
  const marks = total * 4;
  const mins = testData.duration;

  const handleStart = async () => {
    if (language === 'English') { onStart(testData.questions, language); return; }
    try {
      setTranslating(true);
      const res = await api.post('/test/translate', { questions: testData.questions, language });
      onStart(res.data.questions || testData.questions, language);
    } catch {
      onStart(testData.questions, language);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f5', fontFamily: 'Arial, sans-serif' }}>
      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ddd', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>{t.title}</span>
          <span style={{ fontSize: 13, color: '#555' }}>
            {total} {t.qLabel} &nbsp;|&nbsp; {marks} {t.mLabel} &nbsp;|&nbsp; {mins} {t.minLabel}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>{t.langLabel}</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{ padding: '6px 12px', border: '1px solid #bbb', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}
          >
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 960, margin: '24px auto 80px', background: '#fff', border: '1px solid #ddd', borderRadius: 4, padding: '30px 40px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>General Instructions</h2>
        <p style={{ fontWeight: 700, textAlign: 'center', margin: '16px 0 20px' }}>{t.readCarefully}</p>

        <p style={{ fontWeight: 700, textDecoration: 'underline', marginBottom: 8 }}>{t.testInsHeading}</p>
        <ol style={{ lineHeight: 2.2, paddingLeft: 22, fontSize: 14 }}>
          <li>{t.ti1(mins)}</li>
          <li>{t.ti2}</li>
          <li>{t.ti3(total, marks)}</li>
          <li>{t.ti4}</li>
          <li>{t.ti5}</li>
          <li>{t.ti6}</li>
        </ol>

        <p style={{ fontWeight: 700, textDecoration: 'underline', margin: '20px 0 8px' }}>{t.genInsHeading}</p>
        <ol style={{ lineHeight: 2.2, paddingLeft: 22, fontSize: 14 }}>
          <li>
            {t.gi1}
            <div style={{ border: '1px solid #ccc', borderRadius: 4, margin: '10px 0', overflow: 'hidden', maxWidth: 400 }}>
              {Object.entries(STATUS).map(([key, s]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', gap: 12, padding: '6px 10px' }}>
                  <div style={{ width: 26, height: 26, borderRadius: key === 'NOT_VISITED' ? '50%' : 4, background: s.bg, flexShrink: 0, position: 'relative' }}>
                    {s.dot && <div style={{ position: 'absolute', bottom: -2, right: -2, width: 9, height: 9, borderRadius: '50%', background: s.dot, border: '1px solid #fff' }} />}
                  </div>
                  <span style={{ fontSize: 13 }}>{t.statusLabels[key]}</span>
                </div>
              ))}
            </div>
          </li>
          <li>{t.gi2}</li>
        </ol>

        <p style={{ fontWeight: 700, textDecoration: 'underline', margin: '20px 0 8px' }}>{t.navHeading}</p>
        <ol style={{ lineHeight: 2.2, paddingLeft: 22, fontSize: 14 }}>
          <li>{t.nav1}
            <ol type="a" style={{ paddingLeft: 18 }}>
              <li>{t.nav1a}</li>
              <li>{t.nav1b}</li>
              <li>{t.nav1c}</li>
            </ol>
          </li>
        </ol>

        <p style={{ fontWeight: 700, textDecoration: 'underline', margin: '20px 0 8px' }}>{t.ansHeading}</p>
        <ol style={{ lineHeight: 2.2, paddingLeft: 22, fontSize: 14 }}>
          <li>{t.ans1}
            <ol type="a" style={{ paddingLeft: 18 }}>
              <li>{t.ans1a}</li>
              <li>{t.ans1b}</li>
              <li>{t.ans1c}</li>
              <li>{t.ans1d}</li>
              <li>{t.ans1e}</li>
            </ol>
          </li>
        </ol>

        <p style={{ color: '#e74c3c', fontSize: 13, margin: '20px 0 10px' }}>{t.langNote(language)}</p>
        <hr style={{ margin: '16px 0' }} />
        <p style={{ fontSize: 13, lineHeight: 1.8, color: '#333' }}>{t.declaration}</p>

        <div style={{ marginTop: 24, overflowX: 'auto' }}>
          <p style={{ fontWeight: 700, marginBottom: 8 }}>{t.tableHeading}</p>
          <table style={{ borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                {t.tableHeaders.map(h => (
                  <th key={h} style={{ border: '1px solid #ccc', padding: '8px 16px', textAlign: 'center', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px 16px', textAlign: 'center' }}>{language === 'Hindi' ? '\u0916\u0902\u0921 A' : 'Section A'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 16px', textAlign: 'center' }}>MCQ</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 16px', textAlign: 'center' }}>{total}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 16px', textAlign: 'center' }}>4</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 16px', textAlign: 'center' }}>1</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 16px', textAlign: 'center' }}>{marks}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ color: '#e74c3c', fontSize: 13, marginTop: 14 }}>{t.langNote(language)}</p>
      </div>

      {/* Sticky Start button */}
      <div style={{ position: 'fixed', bottom: 0, right: 0, padding: '12px 24px' }}>
        <button
          onClick={handleStart}
          disabled={translating}
          style={{ background: '#5b21b6', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 32px', fontSize: 15, fontWeight: 700, cursor: translating ? 'not-allowed' : 'pointer', opacity: translating ? 0.7 : 1 }}
        >
          {translating ? t.translatingBtn : t.startBtn}
        </button>
      </div>
    </div>
  );
};

// ─── Exam Screen ──────────────────────────────────────────────────────────────
const ExamScreen = ({ testData, questions, language, onSubmit, isSubmitting }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState(new Set([0]));
  const [marked, setMarked] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(testData.duration * 60);
  const [showInstructions, setShowInstructions] = useState(false);
  const timerRef = useRef(null);
  const submitRef = useRef(onSubmit);
  const answersRef = useRef(answers);
  const examStartRef = useRef(Date.now()); // track actual start time

  useEffect(() => { submitRef.current = onSubmit; }, [onSubmit]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  // Lock scroll during exam
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.userSelect = 'none';
    return () => {
      document.body.style.overflow = '';
      document.body.style.userSelect = '';
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          const elapsed = Math.floor((Date.now() - examStartRef.current) / 1000);
          submitRef.current(answersRef.current, questions, elapsed);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const hh = Math.floor(timeLeft / 3600);
  const mm = Math.floor((timeLeft % 3600) / 60);
  const ss = timeLeft % 60;
  const timeStr = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;

  const goTo = (idx) => {
    setVisited(v => new Set([...v, idx]));
    setCurrentIdx(idx);
  };

  const handleSaveNext = () => {
    const next = currentIdx + 1;
    if (next < questions.length) goTo(next);
  };

  const handleMarkReview = () => {
    setMarked(m => {
      const n = new Set(m);
      n.has(currentIdx) ? n.delete(currentIdx) : n.add(currentIdx);
      return n;
    });
    const next = currentIdx + 1;
    if (next < questions.length) goTo(next);
  };

  const handleClear = () => {
    setAnswers(a => { const n = { ...a }; delete n[currentIdx]; return n; });
  };

  const handleSelect = (opt) => setAnswers(a => ({ ...a, [currentIdx]: opt }));

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit the test?')) {
      clearInterval(timerRef.current);
      const elapsed = Math.floor((Date.now() - examStartRef.current) / 1000);
      onSubmit(answers, questions, elapsed);
    }
  };

  const t = CONTENT[language] || CONTENT.English;
  const q = questions[currentIdx];
  const selectedAns = answers[currentIdx];

  const answeredCount = Object.keys(answers).length;
  const notAnsweredCount = [...visited].filter(i => answers[i] === undefined).length;
  const markedCount = marked.size;
  const notVisitedCount = questions.length - visited.size;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f4f4f8', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ddd', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{t.title}</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: timeLeft < 300 ? '#e74c3c' : '#222' }}>
            &#9201; {timeStr}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowInstructions(true)} style={{ padding: '7px 18px', border: '1px solid #999', background: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            {language === 'Hindi' ? '\u0928\u093f\u0930\u094d\u0926\u0947\u0936 \u0926\u0947\u0916\u0947\u0902' : 'View Instructions'}
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} style={{ padding: '7px 18px', background: '#5b21b6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
            {isSubmitting ? '...' : (language === 'Hindi' ? '\u091c\u092e\u093e \u0915\u0930\u0947\u0902' : 'Submit Test')}
          </button>
        </div>
      </div>

      {/* Section tab */}
      <div style={{ padding: '5px 16px', background: '#eee', borderBottom: '1px solid #ddd', flexShrink: 0 }}>
        <span style={{ display: 'inline-block', background: '#fff', border: '1px solid #999', padding: '3px 14px', borderRadius: 3, fontSize: 13, fontWeight: 600 }}>
          {language === 'Hindi' ? '\u0916\u0902\u0921 A' : 'Section A'}
        </span>
      </div>

      {/* Main layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Question panel – extra bottom padding so content isn't hidden under fixed bar */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 90px' }}>
          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <div style={{ width: 34, height: 34, borderRadius: 4, background: '#333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
              {currentIdx + 1}
            </div>
            <span style={{ background: '#eef', border: '1px solid #bbb', borderRadius: 20, padding: '2px 12px', fontSize: 12, fontWeight: 600 }}>Marks: +4 &nbsp; -1</span>
            <span style={{ background: '#eef', border: '1px solid #bbb', borderRadius: 20, padding: '2px 12px', fontSize: 12, fontWeight: 600 }}>Type: Single</span>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: '#777' }}>{language}</span>
          </div>

          {/* Question text */}
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 20, color: '#222' }}>{q.questionText}</p>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isSel = selectedAns === opt;
              const isQuiz = testData.mode === 'Quiz';
              const isCorrect = isQuiz && selectedAns && opt === q.correctAnswer;
              const isWrong = isQuiz && isSel && opt !== q.correctAnswer;
              
              let bgColor = isSel ? '#f3e8ff' : '#fff';
              if (isCorrect) bgColor = '#dcfce7'; // Light green
              if (isWrong) bgColor = '#fee2e2'; // Light red
              
              return (
                <label key={i} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  padding: '12px 16px', 
                  border: `2px solid ${isSel ? '#5b21b6' : '#eee'}`, 
                  background: bgColor, 
                  cursor: 'pointer', 
                  borderRadius: 8,
                  transition: 'all 0.2s ease',
                  boxShadow: isSel ? '2px 2px 0 rgba(0,0,0,0.1)' : 'none'
                }}>
                  <input 
                    type="radio" 
                    name={`q${currentIdx}`} 
                    value={opt} 
                    checked={isSel} 
                    onChange={() => handleSelect(opt)} 
                    style={{ accentColor: '#5b21b6', width: 18, height: 18 }} 
                  />
                  <span style={{ 
                    width: 26, 
                    height: 26, 
                    borderRadius: '50%', 
                    background: isSel ? '#5b21b6' : '#eee', 
                    color: isSel ? '#fff' : '#333', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: 13, 
                    fontWeight: 800, 
                    flexShrink: 0 
                  }}>
                    {letter}
                  </span>
                  <span style={{ fontSize: 15, color: '#222', flex: 1, fontWeight: isSel ? 600 : 400 }}>{opt}</span>
                  {isCorrect && <span style={{ fontSize: 13, fontWeight: 900, color: '#166534' }}>✓ Correct</span>}
                  {isWrong && <span style={{ fontSize: 13, fontWeight: 900, color: '#991b1b' }}>✗ Incorrect</span>}
                </label>
              );
            })}
          </div>

          {/* Quiz Feedback Section */}
          {testData.mode === 'Quiz' && selectedAns && (
            <div style={{ marginTop: 24, padding: '20px', backgroundColor: '#fff', border: '3px solid #000', borderRadius: 12, boxShadow: '6px 6px 0 #000' }}>
              <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 900, 
                  color: selectedAns === q.correctAnswer ? '#166534' : '#991b1b' 
                }}>
                  {selectedAns === q.correctAnswer ? '✨ Brilliant! That\'s Correct.' : '❌ Not quite right.'}
                </span>
              </div>
              {q.explanation && (
                <div style={{ fontSize: 15, lineHeight: 1.6, color: '#333' }}>
                  <strong style={{ display: 'block', marginBottom: 6, textTransform: 'uppercase', fontSize: 12, opacity: 0.6, letterSpacing: '0.05em' }}>Why this is correct:</strong>
                  {q.explanation}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right palette – fixed 220px, no wobble */}
        <div style={{ width: 220, minWidth: 220, borderLeft: '1px solid #ccc', background: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>

          {/* Legend – vertical list, each row same height */}
          <div style={{ padding: '10px 10px 6px', borderBottom: '1px solid #eee' }}>
            {[
              { key: 'NOT_VISITED',     count: notVisitedCount },
              { key: 'NOT_ANSWERED',    count: notAnsweredCount },
              { key: 'ANSWERED',        count: answeredCount },
              { key: 'MARKED',          count: markedCount },
              { key: 'ANSWERED_MARKED', count: markedCount },
            ].map(({ key, count }) => {
              const s = STATUS[key];
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 3, background: s.bg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, position: 'relative' }}>
                    {count}
                    {s.dot && <div style={{ position: 'absolute', bottom: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: s.dot, border: '1px solid #fff' }} />}
                  </div>
                  <span style={{ fontSize: 11, color: '#333', lineHeight: 1.3 }}>{t.statusLabels[key]}</span>
                </div>
              );
            })}
          </div>

          {/* Section label */}
          <div style={{ padding: '6px 10px 4px', borderBottom: '1px solid #eee' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#444' }}>{language === 'Hindi' ? '\u0916\u0902\u0921 A' : 'Section A'}</span>
          </div>

          {/* Question grid – fixed 34x34 square buttons */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '8px 10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 34px)', gap: 4 }}>
              {questions.map((_, i) => {
                const stKey = getQStatus(i, answers, visited, marked);
                const s = STATUS[stKey];
                const isCur = i === currentIdx;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    style={{
                      width: 34, height: 34,
                      border: isCur ? '2px solid #111' : '1px solid transparent',
                      borderRadius: 4,
                      background: s.bg,
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      outline: 'none',
                      position: 'relative',
                      padding: 0,
                      lineHeight: '34px',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    {i + 1}
                    {s.dot && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 7, height: 7, borderRadius: '50%', background: s.dot, border: '1px solid #fff' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar – fixed to viewport so it's always visible */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 220, background: '#fff', borderTop: '2px solid #ddd', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
        {/* Left: clear + previous */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleClear} style={{ padding: '8px 14px', border: '1px solid #999', background: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
            {language === 'Hindi' ? '\u0938\u093e\u092b\u093c' : 'Clear'}
          </button>
          <button
            onClick={() => currentIdx > 0 && goTo(currentIdx - 1)}
            disabled={currentIdx === 0}
            style={{ padding: '8px 16px', border: '1px solid #aaa', background: currentIdx === 0 ? '#f5f5f5' : '#fff', color: currentIdx === 0 ? '#aaa' : '#333', borderRadius: 4, cursor: currentIdx === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            ← {language === 'Hindi' ? '\u092a\u093f\u091b\u0932\u093e' : 'Previous'}
          </button>
        </div>
        {/* Right: mark for review + save & next */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleMarkReview} style={{ padding: '8px 14px', border: '1px solid #8e44ad', color: '#8e44ad', background: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {language === 'Hindi' ? '\u0938\u092e\u0940\u0915\u094d\u0937\u093e & \u0905\u0917\u0932\u093e' : 'Mark for Review & Next'}
          </button>
          <button onClick={handleSaveNext} style={{ padding: '8px 20px', background: '#5b21b6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
            {language === 'Hindi' ? '\u0938\u0939\u0947\u091c\u0947\u0902 & \u0905\u0917\u0932\u093e' : 'Save & Next'}
          </button>
        </div>
      </div>

      {/* Instructions popup */}
      {showInstructions && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 6, padding: 28, maxWidth: 480, width: '90%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setShowInstructions(false)} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#555' }}>&times;</button>
            <h3 style={{ marginTop: 0 }}>Instructions</h3>
            <ul style={{ lineHeight: 2, fontSize: 13, paddingLeft: 18 }}>
              <li>Correct answer: <strong>+4 marks</strong></li>
              <li>Wrong answer: <strong>-1 mark</strong></li>
              <li>Unattempted: <strong>0 marks</strong></li>
              <li>Use <strong>Save &amp; Next</strong> to record your answer.</li>
              <li>Use <strong>Mark for Review</strong> to flag and revisit.</li>
              <li>Language: <strong>{language}</strong></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
const TestCanvasPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [testData, setTestData] = useState(null);
  const [screen, setScreen] = useState('instructions');
  const [questions, setQuestions] = useState([]);
  const [language, setLanguage] = useState('English');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.questions) {
      setTestData(location.state);
    } else {
      navigate('/test-config');
    }
  }, [location, navigate]);

  const handleStart = useCallback((qs, lang) => {
    setQuestions(qs);
    setLanguage(lang);
    setScreen('exam');
  }, []);

  const handleSubmit = useCallback(async (answers, qs, timeTaken) => {
    if (!testData || isSubmitting) return;
    setIsSubmitting(true);
    const formattedAnswers = qs.map((q, idx) => ({
      questionId: q._id,
      answer: answers[idx] || null,
    }));
    // Use actual elapsed time; fall back to full duration if somehow missing
    const finalTime = (typeof timeTaken === 'number' && timeTaken > 0)
      ? timeTaken
      : testData.duration * 60;
    try {
      const res = await api.post('/test/submit', {
        attemptId: testData.attemptId,
        answers: formattedAnswers,
        timeTaken: finalTime,
      });
      if (res.data.success) navigate(`/result/${res.data.resultId}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit test');
      setIsSubmitting(false);
    }
  }, [testData, isSubmitting, navigate]);

  if (!testData) return <div style={{ padding: 40, fontFamily: 'Arial' }}>Loading...</div>;
  if (screen === 'instructions') return <InstructionsScreen testData={testData} onStart={handleStart} />;
  return <ExamScreen testData={testData} questions={questions} language={language} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
};

export default TestCanvasPage;
