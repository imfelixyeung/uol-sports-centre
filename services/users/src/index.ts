import express from 'express';
import {env} from './env';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(env.PORT, env.HOST, () => {
  console.log(`Listening on ${env.HOST}:${env.PORT}`);
});
