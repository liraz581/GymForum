import express, { Express, Request, Response } from 'express';
const app: Express = express();
const PORT: number = 5000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to GymForum API' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});