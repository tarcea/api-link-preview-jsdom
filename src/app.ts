import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { scraper } from './middlewares';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const documentation = 'https://url-preview-gt.herokuapp.com/docs.html';
const howToUse =
  'https://url-preview-gt.herokuapp.com/api?url=http://www.YOUR_URL';

app.get('/', (req: Request, res: Response) => {
  res.json({ documentation, howToUse });
});

app.get('/api', scraper, (req, res) => {
  const { title, description, url, image, icons } = res.locals.result;
  res.json({ title, description, url, image, icons });
});

export default app;
