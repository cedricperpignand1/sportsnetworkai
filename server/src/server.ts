import path from 'path';
import dotenv from 'dotenv';

// Load root .env (../.env from /server)
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });

import express from 'express';
import cors from 'cors';
import { runJudge } from './judge';
import { renderVideo, getPredictionStatus, publicDir } from './utils/replicate';

const app = express();

app.use(cors({
  origin: [/^http:\/\/localhost:5173$/, /^http:\/\/localhost:5174$/],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}));
app.options('/api/*', cors());

app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/media', express.static(publicDir));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/judge-and-generate', async (req, res) => {
  try {
    console.log('Received body:', req.body);
    const { player1Prompt, player2Prompt } = req.body ?? {};

    if (!player1Prompt || !player2Prompt) {
      return res.status(400).json({ error: 'Both prompts required.' });
    }

    const result = await runJudge({ player1Prompt, player2Prompt });
    console.log('Judge result:', {
      winner: result.winner,
      rationale: (result.rationale || '').slice(0, 120) + '...',
    });

    const video = await renderVideo({
      synthesisPrompt: result.synthesisPrompt,
      durationSeconds: 30,
    });

    console.log('Generated video URL:', video.url);

    return res.json({
      winner: result.winner,
      rationale: result.rationale,
      synthesisPrompt: result.synthesisPrompt,
      videoUrl: video.url,
      status: video.status,
      predictionId: video.predictionId ?? null,
    });
  } catch (err: any) {
    console.error('Route error /api/judge-and-generate:', err?.message || err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/check-status', async (req, res) => {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid prediction ID' });
  }

  try {
    const status = await getPredictionStatus(id);
    if (status.status === 'succeeded') {
      return res.json({ status: 'succeeded', url: status.output });
    }

    return res.json({ status: status.status });
  } catch (err: any) {
    console.error('Error checking Replicate status:', err?.message || err);
    return res.status(500).json({ error: 'Failed to check status' });
  }
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
