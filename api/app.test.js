const supertest = require('supertest');
const data = require('./data');
const app = require('./app');

jest.mock('./data', () => ({ queryTxs: jest.fn() }));

const TRANSACTIONS = [
  {
    txHash: '0xabcd',
    blockNumber: '1234',
    time: '2022-01-01',
    from: '0x00001',
    to: '0x00002',
    value: '0.1',
    txFee: '0.05',
  },
];

describe('API /api/txs', () => {
  test('should return transactions', async () => {
    data.queryTxs.mockResolvedValue(TRANSACTIONS);
    const res = await supertest(app).get('/api/txs?a=0xeb2a81e229b68c1c22b6683275c00945f9872d90');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ list: TRANSACTIONS });
  });
});
