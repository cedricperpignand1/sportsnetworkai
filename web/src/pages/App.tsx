// src/pages/App.tsx
import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import PlayerPrompt from '../components/PlayerPrompt';
import Dashboard from '../components/Dashboard';
import VideoScreen from '../components/VideoScreen';
import BetStation from '../components/BetStation';
import NextFightsBox from '../components/NextFightsBox';
import Stats, { type Records } from '../components/Stats';
import Leaderboard, { type Leader } from '../components/Leaderboard';
import type { FightState } from '../types';
import CoachPortal from './CoachPortal';

type Page = 'home' | 'coach';

// Helper to read env for both Vite and Next.js
const getBackendBase = () => {
  // Vite-style
  const vite = (import.meta as any)?.env?.VITE_BACKEND_URL as string | undefined;
  if (vite) return vite;
  // Next.js-style
  const next = (process as any)?.env?.NEXT_PUBLIC_BACKEND_URL as string | undefined;
  if (next) return next;
  // Fallback to relative path (useful if you proxy /api in vercel.json)
  return '';
};

export default function App() {
  const [page, setPage] = useState<Page>('home');

  const [state, setState] = useState<FightState>({
    player1Prompt: '',
    player2Prompt: '',
    status: 'idle',
  });

  const [records, setRecords] = useState<Records>({
    p1: { fights: 0, wins: 0, losses: 0 },
    p2: { fights: 0, wins: 0, losses: 0 },
  });

  // Load records from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('fightRecords');
      if (raw) setRecords(JSON.parse(raw));
    } catch {}
  }, []);

  // Save records to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('fightRecords', JSON.stringify(records));
    } catch {}
  }, [records]);

  const setP1 = (text: string) => setState(s => ({ ...s, player1Prompt: text }));
  const setP2 = (text: string) => setState(s => ({ ...s, player2Prompt: text }));

  const ready = Boolean(state.player1Prompt && state.player2Prompt);

  const applyResultToRecords = (winner?: 'player1' | 'player2' | 'draw') => {
    setRecords(prev => {
      const next = { ...prev, p1: { ...prev.p1 }, p2: { ...prev.p2 } };
      // Each fight increments both fighters' fights
      next.p1.fights += 1;
      next.p2.fights += 1;

      if (winner === 'player1') {
        next.p1.wins += 1;
        next.p2.losses += 1;
      } else if (winner === 'player2') {
        next.p2.wins += 1;
        next.p1.losses += 1;
      }
      // Draw → no win/loss increment
      return next;
    });
  };

  const generateFight = async () => {
    if (!ready) return;
    setState(s => ({ ...s, status: 'submitting' }));

    try {
      const base = getBackendBase(); // ← env-aware base URL
      const resp = await fetch(`${base}/api/judge-and-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1Prompt: state.player1Prompt,
          player2Prompt: state.player2Prompt,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Request failed');

      setState(s => ({
        ...s,
        status: 'ready',
        winner: data.winner,
        rationale: data.rationale,
        synthesisPrompt: data.synthesisPrompt,
        videoUrl: data.videoUrl,
      }));

      // Update records based on winner
      applyResultToRecords(data.winner);
    } catch (e) {
      console.error(e);
      setState(s => ({ ...s, status: 'error' }));
    }
  };

  const reset = () =>
    setState({
      player1Prompt: '',
      player2Prompt: '',
      status: 'idle',
    });

  // Build leaderboard data
  const leaders: Leader[] = useMemo(() => {
    const base: Leader[] = [
      { name: 'Player 1', wins: records.p1.wins, subtitle: 'Power puncher' },
      { name: 'Player 2', wins: records.p2.wins, subtitle: 'Footwork maestro' },
      { name: 'Player 3', wins: 3, subtitle: 'Counter-punch specialist' },
      { name: 'Player 4', wins: 2, subtitle: 'Southpaw tactician' },
      { name: 'Player 5', wins: 1, subtitle: 'Pressure brawler' },
    ];
    return [...base].sort((a, b) => b.wins - a.wins).slice(0, 5);
  }, [records]);

  return (
    <div className="min-h-screen bg-white">
      <Header page={page} onChangePage={setPage} />

      {/* page content wrapper */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          paddingTop: 100, // clears navbar
          paddingLeft: 32,
          paddingRight: 32,
          maxWidth: 1400,
          margin: '0 auto',
          alignItems: 'flex-start',
          gap: 32,
        }}
      >
        {/* LEFT: Stats + Leaderboard */}
        {page === 'home' ? (
          <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Stats records={records} />
            <Leaderboard leaders={leaders} />
          </div>
        ) : (
          <div style={{ width: 240 }} />
        )}

        {/* CENTER: Main */}
        <div style={{ flex: 1 }}>
          {page === 'home' ? (
            <>
              <VideoScreen src={state.videoUrl} status={state.status} />
              <h2 style={{ fontSize: 24, fontWeight: 'bold', marginTop: 12, textAlign: 'center' }}>
                Player 1 vs Player 2
              </h2>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  gap: 40,
                  flexWrap: 'wrap',
                  margin: '32px 0',
                }}
              >
                <PlayerPrompt label="Player 1" onSubmit={setP1} />
                <PlayerPrompt label="Player 2" onSubmit={setP2} />
              </div>

              <div style={{ display: 'flex', gap: 24, marginBottom: 32, justifyContent: 'center' }}>
                <button
                  onClick={generateFight}
                  disabled={!ready || state.status === 'submitting'}
                  style={{
                    padding: '16px 32px',
                    fontSize: 18,
                    fontWeight: 'bold',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: ready ? 'pointer' : 'not-allowed',
                    opacity: !ready || state.status === 'submitting' ? 0.6 : 1,
                  }}
                >
                  {state.status === 'submitting' ? 'Generating…' : 'Generate 20s Fight'}
                </button>

                <button
                  onClick={reset}
                  disabled={state.status === 'submitting'}
                  style={{
                    padding: '16px 32px',
                    fontSize: 18,
                    fontWeight: 'bold',
                    background: '#e5e7eb',
                    color: '#111',
                    border: 'none',
                    borderRadius: 8,
                    cursor: state.status === 'submitting' ? 'not-allowed' : 'pointer',
                    opacity: state.status === 'submitting' ? 0.6 : 1,
                  }}
                >
                  Reset
                </button>
              </div>

              <Dashboard
                player1Prompt={state.player1Prompt}
                player2Prompt={state.player2Prompt}
                winner={state.winner}
                rationale={state.rationale}
                synthesisPrompt={state.synthesisPrompt}
              />

              <div style={{ marginTop: 32 }}>
                <BetStation />
              </div>
            </>
          ) : (
            <CoachPortal />
          )}
        </div>

        {/* RIGHT: Next fights */}
        {page === 'home' && (
          <div style={{ width: 240 }}>
            <NextFightsBox />
          </div>
        )}
      </div>
    </div>
  );
}
