import { useState, useCallback, useMemo } from 'react';

const DOMAINS = ['pattern', 'verbal', 'numerical', 'spatial'];
const QUESTIONS_PER_DOMAIN = 10;
const START_DIFFICULTY = 3;
const MIN_DIFFICULTY = 1;
const MAX_DIFFICULTY = 5;
const CONSECUTIVE_TO_LEVEL_UP = 2;

function initDomainState() {
  const state = {};
  for (const domain of DOMAINS) {
    state[domain] = {
      currentDifficulty: START_DIFFICULTY,
      consecutiveCorrect: 0,
      questionsAnswered: 0,
      answeredIds: new Set(),
    };
  }
  return state;
}

function selectQuestion(questions, domain, difficulty, answeredIds) {
  for (let spread = 0; spread <= 4; spread++) {
    const candidates = questions.filter(
      q => q.domain === domain &&
           Math.abs(q.difficulty - difficulty) <= spread &&
           !answeredIds.has(q.id)
    );
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
  }
  return null;
}

function getNextDomain(domainStates, roundIndex) {
  // Find domains that still have questions to answer
  const available = DOMAINS.filter(
    d => domainStates[d].questionsAnswered < QUESTIONS_PER_DOMAIN
  );
  if (available.length === 0) return null;

  // Round-robin through available domains
  const domainOrder = DOMAINS.filter(d => available.includes(d));
  return domainOrder[roundIndex % domainOrder.length];
}

export function useTestEngine(questions) {
  const [domainStates, setDomainStates] = useState(initDomainState);
  const [answers, setAnswers] = useState([]); // [{questionId, selectedOption, correct, domain, difficulty}]
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const totalAnswered = answers.length;
  const totalQuestions = DOMAINS.length * QUESTIONS_PER_DOMAIN;
  const isComplete = totalAnswered >= totalQuestions || (initialized && currentQuestion === null);

  const progress = Math.round((totalAnswered / totalQuestions) * 100);

  const pickNextQuestion = useCallback((states, nextRoundIndex) => {
    const available = DOMAINS.filter(d => states[d].questionsAnswered < QUESTIONS_PER_DOMAIN);
    if (available.length === 0) return null;

    // Try round-robin through available domains starting from nextRoundIndex
    for (let attempt = 0; attempt < DOMAINS.length; attempt++) {
      const domainOrder = DOMAINS.filter(d => available.includes(d));
      const domain = domainOrder[nextRoundIndex % domainOrder.length];
      const state = states[domain];
      const q = selectQuestion(questions, domain, state.currentDifficulty, state.answeredIds);
      if (q) return { q, domain };
      nextRoundIndex++;
    }
    return null;
  }, [questions]);

  const start = useCallback(() => {
    const states = initDomainState();
    const result = pickNextQuestion(states, 0);
    if (result) {
      setCurrentQuestion(result.q);
    }
    setDomainStates(states);
    setInitialized(true);
  }, [pickNextQuestion]);

  const submitAnswer = useCallback((selectedOption) => {
    if (!currentQuestion) return;

    const newAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        selectedOption,
        domain: currentQuestion.domain,
        difficulty: currentQuestion.difficulty,
      },
    ];
    setAnswers(newAnswers);

    // Update domain state
    const domain = currentQuestion.domain;
    setDomainStates(prev => {
      const updated = { ...prev };
      const state = { ...updated[domain] };
      state.answeredIds = new Set([...state.answeredIds, currentQuestion.id]);
      state.questionsAnswered++;

      // Adaptive difficulty adjustment (server will validate; we don't know correct here)
      // We expose a method to mark correct after server response but for UX we track provisional
      updated[domain] = state;
      return updated;
    });

    const nextRoundIndex = roundIndex + 1;
    setRoundIndex(nextRoundIndex);

    // Pick next question after state update — use functional form
    setDomainStates(prev => {
      const result = pickNextQuestion(prev, nextRoundIndex);
      setCurrentQuestion(result ? result.q : null);
      return prev;
    });
  }, [currentQuestion, answers, roundIndex, pickNextQuestion]);

  /**
   * Call after receiving correct/incorrect feedback to adjust difficulty.
   * @param {boolean} correct
   */
  const applyFeedback = useCallback((correct) => {
    if (!currentQuestion) return;
    const domain = currentQuestion.domain;
    setDomainStates(prev => {
      const updated = { ...prev };
      const state = { ...updated[domain] };

      if (correct) {
        state.consecutiveCorrect = (state.consecutiveCorrect || 0) + 1;
        if (state.consecutiveCorrect >= CONSECUTIVE_TO_LEVEL_UP) {
          state.currentDifficulty = Math.min(MAX_DIFFICULTY, state.currentDifficulty + 1);
          state.consecutiveCorrect = 0;
        }
      } else {
        state.currentDifficulty = Math.max(MIN_DIFFICULTY, state.currentDifficulty - 1);
        state.consecutiveCorrect = 0;
      }

      updated[domain] = state;
      return updated;
    });
  }, [currentQuestion]);

  const getSubmittableAnswers = useCallback(() => {
    return answers.map(({ questionId, selectedOption }) => ({ questionId, selectedOption }));
  }, [answers]);

  return {
    currentQuestion,
    answers,
    totalAnswered,
    totalQuestions,
    progress,
    isComplete,
    initialized,
    start,
    submitAnswer,
    applyFeedback,
    getSubmittableAnswers,
    domainStates,
  };
}
