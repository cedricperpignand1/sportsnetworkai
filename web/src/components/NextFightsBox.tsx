export default function NextFightsBox() {
  return (
    <div
      style={{
        background: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        maxWidth: 320,
        width: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 'bold' }}>Next Fights</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            style={{
              height: 70,
              background: '#ddd',
              borderRadius: 6,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 500,
              color: '#333',
            }}
          >
            Fight Preview {n}
          </div>
        ))}
      </div>
    </div>
  );
}
