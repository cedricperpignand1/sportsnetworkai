// src/components/Stats.tsx
type OneRecord = { fights: number; wins: number; losses: number };

export type Records = {
  p1: OneRecord;
  p2: OneRecord;
};

type Props = {
  records: Records;
};

export default function Stats({ records }: Props) {
  return (
    <aside
      style={{
        position: 'sticky',
        top: 80,
        alignSelf: 'flex-start',
        width: 240,
        background: '#dcdcdcff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,.06)',
      }}
    >
      <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Stats</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Player 1 */}
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Player 1</div>
          <div style={{ fontSize: 14, color: '#374151' }}>Fights: {records.p1.fights}</div>
          <div style={{ fontSize: 14, color: '#065f46' }}>Wins: {records.p1.wins}</div>
          <div style={{ fontSize: 14, color: '#7f1d1d' }}>Losses: {records.p1.losses}</div>
        </div>

        {/* Player 2 */}
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Player 2</div>
          <div style={{ fontSize: 14, color: '#374151' }}>Fights: {records.p2.fights}</div>
          <div style={{ fontSize: 14, color: '#065f46' }}>Wins: {records.p2.wins}</div>
          <div style={{ fontSize: 14, color: '#7f1d1d' }}>Losses: {records.p2.losses}</div>
        </div>
      </div>
    </aside>
  );
}
