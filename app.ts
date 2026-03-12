import express from 'express';
import type { Request, Response } from 'express';
const app = express();
const genres = []
app.use(express.json());
app.get('', (req: Request, res: Response) => {
    res.send('Hello World');
});

export default app;