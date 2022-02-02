const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const scraper = async (req, res, next) => {
  try {
    let details ={}
    const { url } = req.query;
    const response = await axios.default.get(url);
    const dom = new jsdom.JSDOM(response.data);
    const title = dom.window.document.querySelector('title');
    const metas = dom.window.document.querySelectorAll('meta');
    metas?.forEach(meta => {
      const property = meta.getAttribute('property');
      const metaName = meta.getAttribute('name');
      const content = meta.getAttribute('content');
      const itemProp = meta.getAttribute('itemprop');
      details[property || metaName || itemProp] = content;
    });

    const body = dom.window.document.querySelector('body');
    const imgs = Array.from(body.querySelectorAll('img'));
    let bestImgs = [];
  
    imgs?.forEach(img =>
      img.src.indexOf('//') === -1
        ? bestImgs.push(`${url}${img.src}`)
        : bestImgs.push(img.src)
    );

    const bestImg = 
      (details['og:image'] || details['image'])?.indexOf("//") === -1 
      ? 
      `${url}${details['og:image'] || details['image']}` 
      : 
      details['og:image'] || details['image'];

    res.locals.title = title.text;
    res.locals.url = url;
    res.locals.description = details['description'] || details['og:description'];
    res.locals.image = bestImg || bestImgs[0];
    next();
  } catch (error) {
    next(error);
    res.json(error);
  }
};

module.exports = { scraper }