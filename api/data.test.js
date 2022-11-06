const fetch = require('node-fetch');
const { fetchTxs, queryTxs } = require('./data');

jest.mock('node-fetch', () => jest.fn());

const TRANSACTIONS_HTML = `
<table>
  <tbody>
    <tr>
      <td></td>
      <td>0xabcd</td>
      <td></td>
      <td>1234</td>
      <td>2022-01-01</td>
      <td></td>
      <td>0x00001</td>
      <td></td>
      <td>0x00002</td>
      <td>0.1</td>
      <td>0.05</td>
    </tr>
  </tbody>
</table>
`;

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

describe('fetchTxs', () => {
  test('should return transactions', async () => {
    fetch.mockResolvedValue({ text: () => Promise.resolve(TRANSACTIONS_HTML) });
    const data = await fetchTxs('0xeb2a81e229b68c1c22b6683275c00945f9872d90', 1, 50);
    expect(data).toEqual(TRANSACTIONS);
  });
});

describe('queryTxs', () => {
  test('should return transactions from cache', async () => {
    // first query
    fetch.mockResolvedValueOnce({ text: () => Promise.resolve(TRANSACTIONS_HTML) });
    await queryTxs('0xeb2a81e229b68c1c22b6683275c00945f9872d90', 1, 50);

    // second query without fetch
    const data = await queryTxs('0xeb2a81e229b68c1c22b6683275c00945f9872d90', 1, 50);
    expect(data).toEqual(TRANSACTIONS);
  });
});
