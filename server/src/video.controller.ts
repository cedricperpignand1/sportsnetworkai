import express from 'express';
import { renderVideo } from './utils/replicate';

export const videoRouter = express.Router();

videoRouter.post('/', async (req, res) => {
  try {
    const { prompt, duration } = req.body;

    if (!prompt || !duration) {
      return res.status(400).json({ error: 'Prompt and duration are required.' });
    }

    const result = await renderVideo({
      synthesisPrompt: prompt,
      durationSeconds: duration,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Video generation failed:', error);
    return res.status(500).json({ error: 'Failed to generate video.' });
  }
});
