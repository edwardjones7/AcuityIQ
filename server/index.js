'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const questionsRouter = require('./routes/questions');
const scoreRouter     = require('./routes/score');
const checkoutRouter  = require('./routes/checkout');
const emailRouter     = require('./routes/email');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

app.use('/api/questions', questionsRouter);
app.use('/api/score',     scoreRouter);
app.use('/api/checkout',  checkoutRouter);
app.use('/api/email',     emailRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`IQ Test server running on http://localhost:${PORT}`);
});
