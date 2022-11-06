const app = require('./app');

const port = process.env.BLOCKLET_PORT || process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Blocklet app listening on port ${port}`);
});
