import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });

export type VideoJob = { synthesisPrompt: string; durationSeconds: number };
export const publicDir = path.join(__dirname, '..', 'public');
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function renderVideo(job: VideoJob): Promise<{ url: string }> {
  const token = process.env.REPLICATE_API_TOKEN;
  const model = process.env.REPLICATE_T2V_MODEL || 'lucataco/text-to-video';
  const num_frames = Math.min(job.durationSeconds * 5, 81); // Max ~3 seconds

  if (!token) {
    console.error('❌ Missing REPLICATE_API_TOKEN. Falling back to local sample.');
    return { url: '/media/sample-20s.mp4' };
  }

  try {
    const createRes = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: model,
        input: {
          prompt: job.synthesisPrompt,
          fps: 5,
          width: 480,
          height: 256,
          num_frames: 81,
        }
      },
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const prediction = createRes.data;
    const statusUrl = prediction.urls.get;

    let outputUrl = '';
    for (let i = 0; i < 20; i++) {
      await sleep(3000);

      const statusRes = await axios.get(statusUrl, {
        headers: { Authorization: `Token ${token}` }
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

    if (!outputUrl) {
      console.error('❌ Timed out waiting for Replicate video.');
      throw new Error('Replicate timeout');
    }

    console.log('✅ Video generated:', outputUrl);
    return { url: outputUrl };

  } catch (err) {
    console.error('⚠️ Replicate renderVideo error:', err);
    return { url: '/media/sample-20s.mp4' };
  }
}
