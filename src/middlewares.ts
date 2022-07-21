import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

export const isValidUrl = (url: string) => {
  const regex: RegExp =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
  return regex.test(url);
};
export const getDomain = (url: string) => {
  const regex: RegExp = /:\/\/(.[^\/]+)/;
  const domain = url.match(regex);
  if (domain) return domain[1];
  return;
};

export const scraper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const details: any = {};
    const { url } = req.query;

    if (!isValidUrl(url!.toString())) {
      res.status(400).json({ message: 'missing or invalid url' });
      return;
    }

    const domain = getDomain(url!.toString());
    const response = await axios.get(url!.toString());
    const dom = new JSDOM(response.data);
    const title = dom.window.document.querySelector('title');
    const metas = dom.window.document.querySelectorAll('meta');
    metas?.forEach((meta) => {
      const property = meta.getAttribute('property');
      const metaName = meta.getAttribute('name');
      const content = meta.getAttribute('content');
      const itemProp = meta.getAttribute('itemprop');
      const metaUrl = meta.getAttribute('url');

      if (property) {
        details[property] = content;
      } else if (metaName) {
        details[metaName] = content;
      } else if (itemProp) {
        details[itemProp] = content;
      }
    });
    // should be refactored, instead details['og:url'] should be used the domain url
    const manifest = dom.window.document.querySelector('link[rel=manifest]');
    if (manifest) {
      const manifestUrl = 'https://' + domain + manifest.getAttribute('href');
      const manifestResponse = await axios.get(manifestUrl);
      details.icons = manifestResponse.data.icons;
    }
    ///////

    const paragraphs = dom.window.document.querySelectorAll('p');
    const body = dom.window.document.querySelector('body');
    const imgs = Array.from(body!.querySelectorAll('img'));
    let bestImgs: string[] = [];

    imgs?.forEach((img) =>
      img.src.indexOf('//') === -1
        ? bestImgs.push(`${url}${img.src}`)
        : bestImgs.push(img.src)
    );

    const bestImg =
      (details['og:image'] || details['image'])?.indexOf('//') === -1
        ? `${url}${details['og:image'] || details['image']}`
        : details['og:image'] || details['image'];

    const result = {
      title: title?.text,
      url: url,
      description:
        details['description'] ||
        details['og:description'] ||
        paragraphs[0].textContent,
      image: bestImg || bestImgs[0],
      icons: details.icons,
    };

    res.locals.result = result;
    next();
  } catch (err) {
    next(err);
  }
};
