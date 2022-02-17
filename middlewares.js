const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const scraper = async (req, res, next) => {
  try {
    let details ={}
    const { url } = req.query;
    const regex = /:\/\/(.[^/]+)/;
    const domain = url.match(regex)[1];
    console.log(domain)
    const response = await axios.default.get(url);
    const dom = new JSDOM(response.data);
    const title = dom.window.document.querySelector('title');
    const metas = dom.window.document.querySelectorAll('meta');
    metas?.forEach(meta => {
      const property = meta.getAttribute('property');
      const metaName = meta.getAttribute('name');
      const content = meta.getAttribute('content');
      const itemProp = meta.getAttribute('itemprop');
      const metaUrl = meta.getAttribute('url');
      details[property || metaName || itemProp] = content;
    });

    // should be refactored, instead details['og:url'] should be used the domain url 
    const manifest = dom.window.document.querySelector('link[rel=manifest]');
    if (manifest) {
      const manifestUrl = ('https://' + domain + manifest.getAttribute('href'));
      const manifestResponse = await axios.get(manifestUrl)
      details.icons = manifestResponse.data.icons;
    }
    ///////

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

    const result = {
      title: title?.text,
      url: url,
      description: details['description'] || details['og:description'],
      image: bestImg || bestImgs[0],
      icons: details.icons
    }

    res.locals.result = result;
    next();
  } catch (error) {
    next(error);
    // if (error.message.includes('404')) {
    //   res.json({message: 'Yo provided an invalid web address', statusCode: 404});
    //   return;
    // }
    res.json(error);
  }
};

module.exports = { scraper }