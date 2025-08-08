// src/components/Sidebar.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom'; // ✅ Add this

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <aside
      style={{
        position: 'fixed',
        top: 60,
        left: 0,
        height: 'calc(100vh - 60px)',
        width: open ? 180 : 0,
        backgroundColor: '#1f2937',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: open ? 'center' : 'flex-start',
        paddingTop: open ? 24 : 0,
        gap: open ? 20 : 0,
        overflow: 'hidden',
        boxShadow: open ? '2px 0 8px rgba(0,0,0,0.15)' : 'none',
        transition: 'width 0.3s ease, padding 0.3s ease',
        zIndex: 40,
      }}
    >
      {open && (
        <>
          <h2 style={{ fontWeight: 'bold', fontSize: 18 }}>Menu</h2>

          {/* ✅ Link to Coach Portal */}
          <Link to="/coach-portal" style={linkStyle}>
            Coach Portal
          </Link>
        </>
      )}
    </aside>
  );
}

const linkStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 500,
  padding: '6px 12px',
  borderRadius: 4,
  cursor: 'pointer',
  transition: 'background 0.2s',
  width: '100%',
  textAlign: 'center',
  userSelect: 'none',
  textDecoration: 'none', // removes underline
  color: 'white',
};
