const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const scraper = async (req, res, next) => {
  try {
    const { url } = req.query;
    const response = await axios.default.get(url);
    const dom = new jsdom.JSDOM(response.data);
    const title = dom.window.document.querySelector('title');
    res.locals.title = title.text
    next();
  } catch (error) {
    res.json(error)
  }
};

module.exports = { scraper }