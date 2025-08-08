// src/components/Leaderboard.tsx
export type Leader = {
  name: string;
  wins: number;
  subtitle?: string;
};

type Props = {
  leaders: Leader[];
};

export default function Leaderboard({ leaders }: Props) {
  return (
    <aside
      style={{
        position: 'sticky',
        top: 320, // sits under the Stats panel
        alignSelf: 'flex-start',
        width: 240,
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,.06)',
      }}
    >
      <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Leaderboard</h3>

      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
        {leaders.slice(0, 5).map((item, idx) => (
          <li
            key={item.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              border: '1px solid #eef2f7',
              borderRadius: 10,
              background: '#f9fafb',
            }}
          >
            {/* Rank pill */}
            <div
              style={{
                minWidth: 28,
                height: 28,
                borderRadius: 999,
                border: '1px solid #d1d5db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 12,
                background: '#fff',
              }}
            >
              {idx + 1}
            </div>

            {/* Name + subtitle */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#111' }}>{item.name}</div>
              {item.subtitle && (
                <div style={{ fontSize: 12, color: '#6b7280' }}>{item.subtitle}</div>
              )}
            </div>

            {/* Wins badge */}
            <div
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                background: '#e0f2fe',
                border: '1px solid #bae6fd',
                color: '#075985',
                fontWeight: 700,
                fontSize: 12,
                whiteSpace: 'nowrap',
              }}
              title="Total games won"
            >
              {item.wins} wins
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
