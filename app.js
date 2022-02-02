const express = require('express');
const cors = require('cors');
const { scraper } = require('./middlewares');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('api for link preview scraping')
});

app.get('/api', scraper, (req, res) => {
  const { title } = res.locals;
  res.json({title})
})

module.exports = app;