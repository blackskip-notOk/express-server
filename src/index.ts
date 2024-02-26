import bodyParser from 'body-parser';
import express from 'express';
import type { Express } from 'express';
import { authRouter } from './routes'

const PORT = 3000;

const app: Express = express();

app.use(bodyParser.json());

app.use(authRouter);

app.get('/', (req, res) => {
	res.send('Hello World!')
  })

app.listen(PORT, () => {
	console.info(`⚡️ Server is running at https://localhost:${PORT}`);
});
