type Props = {
  player1Prompt: string;
  player2Prompt: string;
  winner?: 'player1' | 'player2' | 'draw';
  rationale?: string;
  synthesisPrompt?: string;
};

export default function Dashboard({
  player1Prompt,
  player2Prompt,
  winner,
  rationale,
  synthesisPrompt,
}: Props) {
  return (
    <div
      style={{
        maxWidth: '100%',
        padding: 16,
        border: '1px solid #eee',
        borderRadius: 8,
        boxSizing: 'border-box',
        margin: '0 auto',
      }}
    >
      <h3 style={{ fontSize: 20, marginBottom: 12 }}>Dashboard</h3>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <h4>Player 1</h4>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {player1Prompt || '—'}
          </pre>
        </div>

        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <h4>Player 2</h4>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {player2Prompt || '—'}
          </pre>
        </div>
      </div>

      {winner && (
        <div style={{ marginTop: 20 }}>
          <h4>Judge Result: {winner.toUpperCase()}</h4>
          <p>{rationale}</p>
          <details>
            <summary>Video Synthesis Prompt</summary>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {synthesisPrompt}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
