import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchQuestions, submitAnswers } from '../services/api.js';
import { useTestEngine } from '../hooks/useTestEngine.js';
import { useTimer } from '../hooks/useTimer.js';
import { DOMAIN_COLORS } from '../utils/scoring.js';
import Header from '../components/layout/Header.jsx';
import ProgressBar from '../components/layout/ProgressBar.jsx';
import QuestionCard from '../components/test/QuestionCard.jsx';
import Timer from '../components/test/Timer.jsx';

export default function TestPage() {
  const navigate = useNavigate();
  const [questions, setQuestions]           = useState(null);
  const [loadError, setLoadError]           = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting]         = useState(false);

  const engine = useTestEngine(questions || []);
  const timer  = useTimer();

  useEffect(() => {
    fetchQuestions()
      .then(qs => setQuestions(qs))
      .catch(() => setLoadError('Failed to load questions. Is the server running?'));
  }, []);

  useEffect(() => {
    if (questions?.length > 0 && !engine.initialized) engine.start();
  }, [questions, engine.initialized]); // eslint-disable-line

  useEffect(() => {
    if (engine.isComplete && engine.answers.length > 0 && !submitting) {
      setSubmitting(true);
      submitAnswers(engine.getSubmittableAnswers())
        .then(results => {
          sessionStorage.setItem('iqResults', JSON.stringify(results));
          navigate('/results', { state: { results } });
        })
        .catch(() => { setLoadError('Failed to submit. Please try again.'); setSubmitting(false); });
    }
  }, [engine.isComplete]); // eslint-disable-line

  function handleNext() {
    if (!selectedOption) return;
    engine.submitAnswer(selectedOption);
    setSelectedOption(null);
  }

  const domainColor = engine.currentQuestion ? DOMAIN_COLORS[engine.currentQuestion.domain] : '#E11D48';
  const isLast = engine.initialized && engine.totalAnswered + 1 === engine.totalQuestions;

  if (loadError) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-sm w-full p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-rose-500 font-bold text-lg">!</span>
          </div>
          <p className="font-semibold text-rose-900 mb-1">Something went wrong</p>
          <p className="text-sm text-rose-400 mb-6">{loadError}</p>
          <button onClick={() => window.location.reload()} className="btn-primary w-full">Try Again</button>
        </motion.div>
      </div>
    );
  }

  if (!questions || !engine.initialized || !engine.currentQuestion || submitting || engine.isComplete) {
    const msg = (submitting || engine.isComplete)
      ? { title: 'Analysing results', sub: 'Computing your cognitive profile...' }
      : { title: 'Loading questions', sub: 'Just a moment...' };
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-5">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="#F2DADE" strokeWidth="4" />
              <motion.circle cx="28" cy="28" r="22" fill="none" stroke="#E11D48" strokeWidth="4"
                strokeLinecap="round" strokeDasharray="138"
                initial={{ strokeDashoffset: 138 }} animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }} />
            </svg>
          </div>
          <p className="font-semibold text-rose-900 text-sm">{msg.title}</p>
          <p className="text-xs text-rose-400 mt-1">{msg.sub}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }} className="min-h-screen bg-rose-50 flex flex-col">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${domainColor}0D 0%, transparent 70%)` }} />

      <Header title="IQ Assessment"
        subtitle={`Question ${engine.totalAnswered + 1} of ${engine.totalQuestions}`} />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 pt-5 pb-8 relative z-10">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <ProgressBar current={engine.totalAnswered} total={engine.totalQuestions} domains={engine.domainStates} />
          </div>
          <Timer formatted={timer.formatted} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={engine.totalAnswered}
            initial={{ opacity: 0, x: 32, scale: 0.99 }}
            animate={{ opacity: 1, x: 0,  scale: 1 }}
            exit={{    opacity: 0, x: -32, scale: 0.99 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <QuestionCard question={engine.currentQuestion} selectedOption={selectedOption}
              onSelect={setSelectedOption} questionNumber={engine.totalAnswered + 1} />
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex justify-end">
          <motion.button
            onClick={handleNext}
            disabled={!selectedOption}
            whileHover={selectedOption ? { scale: 1.02 } : {}}
            whileTap={selectedOption ? { scale: 0.97 } : {}}
            className="btn-primary text-sm px-8 py-3"
            style={selectedOption
              ? { background: domainColor, boxShadow: `0 6px 20px ${domainColor}35` }
              : { background: '#E8BEC6', boxShadow: 'none', cursor: 'not-allowed', opacity: 0.7 }
            }
          >
            {isLast ? (
              <>Finish Test
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            ) : (
              <>Next
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
