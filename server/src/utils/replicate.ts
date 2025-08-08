// ------------------------------
// replicate.ts
// ------------------------------
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });

export type VideoJob = { synthesisPrompt: string; durationSeconds: number };
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function renderVideo(job: VideoJob): Promise<{
  url: string | null;
  status: string;
  predictionId?: string;
}> {
  const token = process.env.REPLICATE_API_TOKEN;
  const model = process.env.REPLICATE_T2V_MODEL;
  const num_frames = Math.min(job.durationSeconds * 24, 81);

  if (!token || !model) {
    console.error('❌ Missing REPLICATE_API_TOKEN or REPLICATE_T2V_MODEL.');
    return { url: '/media/sample-20s.mp4', status: 'error' };
  }

  try {
    const createRes = await axios.post(
      `https://api.replicate.com/v1/models/${model}/predictions`,
      {
        input: {
          prompt: job.synthesisPrompt,
          fps: 24,
          width: 480,
          height: 256,
          num_frames: 81,
        },
      },
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const prediction = createRes.data;
    const statusUrl = prediction.urls.get;

    let outputUrl = '';
    for (let i = 0; i < 120; i++) {
      await sleep(3000);
      const statusRes = await axios.get(statusUrl, {
        headers: { Authorization: `Token ${token}` },
      });

      const status = statusRes.data;
      console.log(`📡 Replicate status: ${status.status}`);

      if (status.status === 'succeeded') {
        outputUrl = status.output;
        break;
      }

      if (['failed', 'canceled'].includes(status.status)) {
        console.error('❌ Replicate generation failed:', status);
        throw new Error('Replicate generation failed');
      }
    }

    if (outputUrl) {
      console.log('✅ Video generated:', outputUrl);
      return { url: outputUrl, status: 'succeeded', predictionId: prediction.id };
    } else {
      console.warn('⏳ Still processing after timeout. Returning ID...');
      return { url: null, status: 'processing', predictionId: prediction.id };
    }
  } catch (err) {
    console.error('⚠️ Replicate renderVideo error:', err);
    return { url: '/media/sample-20s.mp4', status: 'error' };
  }
}

export async function getPredictionStatus(predictionId: string): Promise<any> {
  const token = process.env.REPLICATE_API_TOKEN;
  const res = await axios.get(`https://api.replicate.com/v1/predictions/${predictionId}`, {
    headers: { Authorization: `Token ${token}` },
  });
  return res.data;
}

export const publicDir = path.join(__dirname, '..', 'public');
