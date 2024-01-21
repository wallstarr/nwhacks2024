const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001; // You can use any available port

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, this is your Node.js backend!');
});

app.get('/api/data', (req, res) => {
    const data = { message: 'This is data from your API endpoint!' };
    res.json(data);
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});