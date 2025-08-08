type Props = {
  src?: string;
  status: 'idle' | 'submitting' | 'ready' | 'error';
};

export default function VideoScreen({ src, status }: Props) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 80,                // ⬅️ match your navbar+spacing (use 100 if that’s your App paddingTop)
        alignSelf: 'flex-start',// ⬅️ important inside flex layouts
        width: '100%',
        padding: '0 16px',
        // no fixed height — lets sticky behave correctly
      }}
    >
      <div style={{ width: '100%', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h3
          style={{
            color: '#111',
            marginBottom: 12,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Live Arena (20s)
        </h3>

        <div
          style={{
            aspectRatio: '16/9',
            background: '#000',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 0 12px rgba(0,0,0,0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {status === 'submitting' && <p style={textStyle}>Generating fight…</p>}

          {status === 'ready' && src && (
            <video
              src={src}
              controls
              autoPlay
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}

          {status === 'idle' && <p style={textStyle}>Awaiting prompts…</p>}
          {status === 'error' && <p style={textStyle}>Error loading video.</p>}
        </div>
      </div>
    </div>
  );
}

const textStyle: React.CSSProperties = {
  color: '#fff',
  fontSize: 18,
  fontWeight: 500,
};
