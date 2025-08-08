import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });

import OpenAI from 'openai';

export type JudgeInput = { player1Prompt: string; player2Prompt: string };
export type JudgeResult = {
  winner: 'player1' | 'player2' | 'draw';
  rationale: string;
  synthesisPrompt: string;
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// quick sanity log (will print true if the key is present)
console.log('OpenAI key present:', Boolean(process.env.OPENAI_API_KEY));

const BOXING_RULES = `
- No kicks, knees, elbows, or headbutts.
- Punches only: jabs, crosses, hooks, uppercuts.
- No punches to the back of the head; no low blows.
- Clinch breaks quickly; referee may separate fighters.
- Standard boxing ring, crowd, announcer, judges.
`;

export async function runJudge(input: JudgeInput): Promise<JudgeResult> {
  const sys = `You are an impartial AI boxing judge for a stylized simulation video.
Decide a likely winner from two strategies under boxing rules, then craft one vivid ~20s video prompt
blending both styles (safe, non-graphic).`;

  const user = `
Player 1:
${input.player1Prompt}

Player 2:
${input.player2Prompt}

Rules:
${BOXING_RULES}

Tasks:
1) winner: "player1" | "player2" | "draw"
2) rationale: short paragraph
3) synthesisPrompt: one paragraph for a short highlight video (scene cues, pacing, decisive ending favoring winner)

Respond strictly as JSON with keys: winner, rationale, synthesisPrompt.
`;

  const resp = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
    response_format: { type: 'json_object' },
    temperature: 0.7
  });

  const content = resp.choices[0]?.message?.content ?? '{}';
  const json = JSON.parse(content);

  const winner: 'player1' | 'player2' | 'draw' =
    json.winner === 'player1' || json.winner === 'player2' ? json.winner : 'draw';

  return {
    winner,
    rationale: json.rationale ?? '',
    synthesisPrompt: json.synthesisPrompt ?? ''
  };
}
