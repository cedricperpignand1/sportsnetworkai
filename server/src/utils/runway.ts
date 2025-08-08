import axios from 'axios';

export async function generateRunwayVideo(prompt: string, duration: number) {
  const apiKey = process.env.RUNWAY_API_KEY;
  const frames = Math.min(duration * 24, 240); // 24 fps capped at 240

  const response = await axios.post(
    'https://api.runwayml.com/v1/inference/gen-2-lightning',
    {
      input: {
        prompt,
        fps: 24,
        width: 512,
        height: 512,
        num_frames: frames,
        output_format: 'mp4',
      }
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data; // contains id, status, output, etc.
}
