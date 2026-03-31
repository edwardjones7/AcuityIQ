import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchQuestions() {
  const { data } = await api.get('/questions');
  return data.questions;
}

export async function submitAnswers(answers) {
  const { data } = await api.post('/score', { answers });
  return data;
}

export async function captureEmail({ email, iq, band, percentile }) {
  const { data } = await api.post('/email/capture', { email, iq, band, percentile });
  return data;
}

export async function createCheckoutSession() {
  const { data } = await api.post('/checkout/create-session');
  return data.url;
}

export async function verifyPayment(sessionId) {
  const { data } = await api.post('/checkout/verify', { sessionId });
  return data.paid;
}
