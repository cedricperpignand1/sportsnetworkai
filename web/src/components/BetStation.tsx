export default function BetStation() {
  return (
    <div
      style={{
        background: 'linear-gradient(to bottom right, #3b82f6, #60a5fa)',
        color: 'white',
        borderRadius: 10,
        padding: 16,
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
        fontFamily: 'sans-serif',
        width: '100%',
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
        💰 Bet Station
      </h3>
      <p style={{ fontSize: 14, lineHeight: 1.4, marginBottom: 12 }}>
        Place your bets on:
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <button
          style={{
            flex: 1,
            background: '#fff',
            color: '#1f2937',
            padding: '8px 10px',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Player 1
        </button>
        <button
          style={{
            flex: 1,
            background: '#fff',
            color: '#1f2937',
            padding: '8px 10px',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Player 2
        </button>
      </div>
    </div>
  );
}
