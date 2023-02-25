import express from 'express';
import {env} from './env';

const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World',
  });
});

const {PORT, HOST} = env;

app.listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}`));
