import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/AuthMiddleware';
import OpenAI from 'openai';
require('dotenv').config();

const router = Router();

const generateAiResponse: RequestHandler = async (req, res) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const text: string = req.body.text;

        if (!text) {
            res.status(400).json({ message: 'Prompt is required' });
            return;
        }

        const systemContent: string = 'You are a fact checking AI for a Gym Forum. Use studies from a trusted source' +
                                     'and biomechanics theories to approve or disprove the statement below.' +
                                     'If a statement doesn\'t seem like it needs fact-checking you may say so.' +
                                     'Keep your answer short - up to 3 lines.';


        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: systemContent,
                },
                {
                    role: 'user',
                    content: `Fact-check this post:\n\n"${text}"`,
                },
            ],
        });

        const result = response.choices[0].message.content;
        console.log('AI response:', result);

        if (!result) {
            throw new Error(`OpenAI response is empty`);
        }

        res.json({ result }).status(200).send();
    } catch (error: any) {
        console.error('Error generating AI response:', error.message);
        res.status(500).json({ message: 'Error generating AI response' });
    }
};

router.post('/factcheck', authenticateToken, generateAiResponse);

export default router;