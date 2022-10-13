import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { scraper } from './middlewares';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const documentation = 'docs.html';
const howToUse = 'api?url=http://www.github.com/tarcea';

app.get('/', (req: Request, res: Response) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  res.json({
    documentation: fullUrl + documentation,
    howToUse: fullUrl + howToUse,
  });
});

app.get('/api', scraper, (req, res) => {
  const { title, description, url, image, icons } = res.locals.result;
  res.json({ title, description, url, image, icons });
});

export default app;
