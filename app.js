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
  const { title, description, url } = res.locals;
  res.json({ title, description, url })
})

module.exports = app;