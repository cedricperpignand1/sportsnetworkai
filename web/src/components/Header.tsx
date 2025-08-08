// src/components/Header.tsx
import { FaCog } from 'react-icons/fa';

interface HeaderProps {
  page: 'home' | 'coach';
  onChangePage: (p: 'home' | 'coach') => void;
}

export default function Header({ page, onChangePage }: HeaderProps) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#fafafaff',
        padding: '12px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,.12)',
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Left: Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src="/logo4.png"
            alt="AI Boxing Logo"
            style={{ height: 40, width: 40, objectFit: 'contain' }}
          />
          <strong style={{ fontSize: 24, color: '#111', whiteSpace: 'nowrap' }}>
            Sports Network AI
          </strong>
        </div>

        {/* Middle: Nav buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onChangePage('home')}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #ddd',
              background: page === 'home' ? '#111' : '#fff',
              color: page === 'home' ? '#fff' : '#111',
              cursor: 'pointer',
            }}
          >
            Watch Live
          </button>
          <button
            onClick={() => onChangePage('coach')}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #ddd',
              background: page === 'coach' ? '#111' : '#fff',
              color: page === 'coach' ? '#fff' : '#111',
              cursor: 'pointer',
            }}
          >
            My Player
          </button>
        </div>

        {/* Right: Auth + Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => alert('Login clicked (mock)!')}
            style={{
              background: '#fff',
              color: '#dc2626',
              padding: '8px 14px',
              borderRadius: 8,
              fontWeight: 600,
              border: '1px solid rgba(0,0,0,0.4)',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
          <button
            onClick={() => alert('Sign Up clicked (mock)!')}
            style={{
              background: '#fd4747ff',
              color: '#fefefeff',
              padding: '8px 14px',
              borderRadius: 8,
              fontWeight: 700,
              border: '1px solid rgba(0,0,0,.06)',
              cursor: 'pointer',
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => alert('Settings clicked (mock)!')}
            style={{
              background: '#e5e7eb',
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: '#333',
            }}
            title="Settings"
          >
            <FaCog />
          </button>
        </div>
      </nav>
    </header>
  );
}
