const express = require('express');
const cors = require('cors');
const { scraper } = require('./middlewares');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('https://url-preview-gt.herokuapp.com/api?url=http://www.YOUR_URL')
});

app.get('/api', scraper, (req, res) => {
  const { title, description, url, image } = res.locals.result;
  res.json({ title, description, url, image });
})

module.exports = app;