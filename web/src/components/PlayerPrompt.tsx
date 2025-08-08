import { useState } from 'react';

type Props = {
  label: 'Player 1' | 'Player 2';
  onSubmit: (text: string) => void;
};

export default function PlayerPrompt({ label, onSubmit }: Props) {
  const [text, setText] = useState('');

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (text.trim()) onSubmit(text.trim());
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: 12,
        borderRadius: 8,
        width: 300,
        background: '#f9f9f9',
        fontSize: 14,
      }}
    >
      <h3 style={{ fontSize: 16 }}>{label} Prompt</h3>
      <p style={{ margin: '6px 0', fontSize: 11, color: '#666' }}>
        Press <b>Ctrl/Cmd+Enter</b> to submit.
      </p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKey}
        rows={4}
        placeholder="e.g., Fast footwork, sharp jab..."
        style={{
          width: '100%',
          resize: 'vertical',
          fontSize: 13,
        }}
      />
      <div style={{ marginTop: 8 }}>
        <button
          onClick={() => text.trim() && onSubmit(text.trim())}
          style={{
            padding: '6px 12px',
            background: '#000000ff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
