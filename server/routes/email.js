'use strict';

const express = require('express');
const router  = express.Router();

// Simple email capture — stores leads in memory (swap for DB/SendGrid later)
const leads = [];

router.post('/capture', (req, res) => {
  const { email, iq, band, percentile } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  leads.push({
    email,
    iq:         iq        || null,
    band:       band      || null,
    percentile: percentile || null,
    capturedAt: new Date().toISOString(),
  });

  console.log(`[Lead] ${email} — IQ ${iq} (${band})`);

  res.json({ ok: true });
});

module.exports = router;
