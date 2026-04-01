'use strict';

const express = require('express');
const router = express.Router();
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Create a Stripe Checkout session for $4.99 results unlock
router.post('/create-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Acuity Full Results Report',
              description: 'Complete IQ score, 4-domain breakdown, percentile rank, written cognitive analysis & certificate.',
            },
            unit_amount: 299, // $2.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${CLIENT_URL}/results?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/results?cancelled=true`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Verify a completed Stripe Checkout session
router.post('/verify', async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';
    res.json({ paid });
  } catch (err) {
    console.error('Stripe verify error:', err.message);
    res.status(400).json({ error: 'Invalid session ID' });
  }
});

module.exports = router;
