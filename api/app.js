const express = require('express');
const { queryTxs } = require('./data');
const env = require('./libs/env');

const app = express();

const MAX_PAGE_SIZE = 100;

app.get('/', (req, res) => {
  res.send(`
<div style="display:flex;flex-direction:column;align-items:center;padding:64px 0;">
<h1 style="margin:64px 0;">
  <span style="display:inline-block;padding:8px 24px;background:#1dc1c7;color:#fff;">Blocklet</span>
  <span style="color:#777;">+ Express</span>
</h1>
<pre>
${JSON.stringify(env, null, 2)}
</pre>
</div>
  `);
});

app.get('/api/txs', async (req, res) => {
  const { a, p = '1', ps = '50' } = req.query;
  if (!a) {
    throw new Error('Missing required query parameter address `a`');
  }

  const page = Number(p);
  if (!Number.isInteger(page) || !(p > 0 && p < Number.MAX_SAFE_INTEGER)) {
    throw new Error('Invalid page');
  }
  const pageSize = Number(ps);
  if (!Number.isInteger(pageSize) || !(ps > 0 && ps < MAX_PAGE_SIZE)) {
    throw new Error('Invalid page size');
  }

  res.json({
    list: await queryTxs(a, page, pageSize),
  });
});

module.exports = app;
