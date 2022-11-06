const fetch = require('node-fetch');
const htmlParser = require('node-html-parser');

/**
 * fetch transactions of address from etherscan.io
 * @param {String} a address to query
 * @param {Number} p page number, default is 1
 * @param {Number} ps page size, only support 10, 25, 50, and 100, default is 50
 * @returns {Array} transactions
 */
async function fetchTxs(a, p = 1, ps = 50) {
  if (typeof a !== 'string' || !a.trim()) {
    throw new Error('Invalid address');
  }
  if (typeof p !== 'number' || !(p > 0 && p < Number.MAX_SAFE_INTEGER)) {
    throw new Error('Invalid page');
  }
  // The url of https://etherscan.io/txs only support 10, 25, 50, and 100 page size
  if (![10, 25, 50, 100].includes(ps)) {
    throw new Error('Invalid page size');
  }

  const url = new URL('https://etherscan.io/txs');
  url.searchParams.set('a', a);
  url.searchParams.set('p', p);
  url.searchParams.set('ps', ps);

  const r = await fetch(url);
  const html = await r.text();
  const dom = htmlParser.parse(html.replaceAll("<span style='white-space: nowrap;'>", ''));
  const rows = dom.querySelectorAll('table tbody tr');

  return rows.map((row) => {
    const tds = row.querySelectorAll('td');
    return {
      txHash: tds[1].textContent.trim(),
      blockNumber: tds[3].textContent.trim(),
      time: tds[4].textContent.trim(),
      from: tds[6].textContent.trim(),
      to: tds[8].textContent.trim(),
      value: tds[9].textContent.trim(),
      txFee: tds[10].textContent.trim(),
    };
  });
}

const CACHE_EXPIRES_IN = 30;

/**
 * Transactions cache map.
 * Key format: `${address}-${page}-${pageSize}`
 * Value structure: {expiredAt: Number, data: Array<Transaction>}
 */
const CACHE = new Map();

/**
 * query transactions of address, return cached data if there is already a cache.
 * @param {String} a address to query
 * @param {Number} p page number, default is 1
 * @param {Number} ps page size, only support 10, 25, 50, and 100, default is 50
 * @returns {Array} transactions
 */
async function queryTxs(a, p = 1, ps = 50) {
  const cacheKey = `${a}-${p}-${ps}`;
  const cache = CACHE.get(cacheKey);
  const now = Math.floor(Date.now() / 1000);
  if (cache && cache.expiredAt >= now) {
    return cache.data;
  }
  const data = await fetchTxs(a, p, ps);
  CACHE.set(cacheKey, {
    expiredAt: Math.floor(Date.now() / 1000) + CACHE_EXPIRES_IN,
    data,
  });
  return data;
}

module.exports.fetchTxs = fetchTxs;
module.exports.queryTxs = queryTxs;
