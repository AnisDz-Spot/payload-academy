'use client'
import React, { useState } from 'react';
import { Quiz } from '@/data/types';
import { useAcademy } from '@/context/AcademyContext';
import { playSuccessChime } from '@/lib/sound';

export const QuizCard: React.FC<{ quiz: Quiz; lessonId: string }> = ({ quiz, lessonId }) => {
  const { completedQuizzes, recordQuizPass, soundEnabled } = useAcademy();
  const isAlreadyPassed = Boolean(completedQuizzes[lessonId]);
  const [selectedOption, setSelectedOption] = useState<number | null>(
    isAlreadyPassed ? quiz.correct : null
  );

  const handleSelect = (idx: number) => {
    if (selectedOption !== null && selectedOption === quiz.correct) return;
    setSelectedOption(idx);
    if (idx === quiz.correct) {
      if (soundEnabled) playSuccessChime();
      recordQuizPass(lessonId);
    }
  };

  return (
    <div className={`quiz${isAlreadyPassed ? ' quiz-passed' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>🧠 Quick check: {quiz.question}</h3>
        {isAlreadyPassed && (
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', background: 'rgba(22, 163, 74, 0.12)', padding: '10px', borderRadius: 9999, border: '1px solid rgba(22, 163, 74, 0.25)', minWidth: 'fit-content' }}>
            ✓ Quiz Passed
          </span>
        )}
      </div>

      <div className="quiz-options">
        {quiz.options.map((option, idx) => {
          let btnClass = 'qo';
          if (selectedOption !== null) {
            if (idx === quiz.correct) btnClass += ' ok';
            else if (idx === selectedOption) btnClass += ' no';
          }
          return (
            <button
              key={idx}
              className={btnClass}
              disabled={selectedOption !== null && selectedOption === quiz.correct}
              onClick={() => handleSelect(idx)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedOption !== null && (
        <div className="qx">
          {selectedOption === quiz.correct ? '✅ Correct! ' : '❌ Not quite. '}
          {quiz.explanation}
        </div>
      )}
    </div>
  );
};
