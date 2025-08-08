export type FightState = {
  player1Prompt: string;
  player2Prompt: string;
  winner?: 'player1' | 'player2' | 'draw';
  rationale?: string;
  synthesisPrompt?: string;
  videoUrl?: string;
  status: 'idle' | 'submitting' | 'ready' | 'error';
};
