// src/CoachPortal.tsx
import { useEffect, useState } from 'react';

type Profile = {
  imageDataUrl: string; // base64 for preview + persistence
  prompt: string;
  savedAt: string;
};

export default function CoachPortal() {
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string>('');

  const [scheduling, setScheduling] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState<string>('');

  // Load existing profile if present
  useEffect(() => {
    try {
      const raw = localStorage.getItem('coachProfile');
      if (raw) {
        const parsed: Profile = JSON.parse(raw);
        setImageDataUrl(parsed.imageDataUrl || '');
        setPrompt(parsed.prompt || '');
      }
    } catch (e) {
      console.warn('Could not load saved profile', e);
    }
  }, []);

  const handleFileChange = (file?: File) => {
    setError('');
    setSavedMessage('');
    setScheduleMessage('');
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, or JPEG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image is too large. Max size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result));
    reader.onerror = () => setError('Failed to read image. Try a different file.');
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const onSave = async () => {
    setError('');
    setSavedMessage('');
    setScheduleMessage('');

    if (!imageDataUrl) {
      setError('Please upload a character image first.');
      return;
    }
    if ((prompt?.trim().length || 0) < 200) {
      setError('Your prompt must be at least 200 characters.');
      return;
    }

    setSaving(true);
    try {
      const profile: Profile = {
        imageDataUrl,
        prompt: prompt.trim(),
        savedAt: new Date().toISOString(),
      };

      // Persist locally
      localStorage.setItem('coachProfile', JSON.stringify(profile));

      // (Optional) Send to your server later:
      // await fetch('http://localhost:3001/api/character', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profile),
      // });

      setSavedMessage('Profile saved ✅');
    } catch (e: any) {
      setError(e?.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const onScheduleNextFight = async () => {
    // Mock scheduling: require a valid profile first so it feels real
    setError('');
    setScheduleMessage('');

    if (!imageDataUrl) {
      setError('Upload your character image before scheduling.');
      return;
    }
    if ((prompt?.trim().length || 0) < 200) {
      setError('Your prompt must be at least 200 characters before scheduling.');
      return;
    }

    setScheduling(true);
    try {
      // Persist a simple flag + timestamp (mock)
      localStorage.setItem(
        'notifyNextFight',
        JSON.stringify({ enabled: true, at: new Date().toISOString() })
      );
      setScheduleMessage('You’re on the list! We’ll notify you for the next available fight. 🔔');
      // Optionally: alert('Scheduled (mock)!');
    } catch (e: any) {
      setError(e?.message || 'Failed to schedule. Please try again.');
    } finally {
      setScheduling(false);
    }
  };

  const chars = prompt.trim().length;
  const minReached = chars >= 200;

  return (
    <div style={{ padding: '1.5rem 0', color: '#111' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
        Your Player
      </h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Upload your fighter’s image and write a detailed persona prompt (200+ characters). Then save.
      </p>

      {/* Error / success */}
      {error && (
        <div
          style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#7f1d1d',
            padding: '12px 14px',
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}
      {savedMessage && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#064e3b',
            padding: '12px 14px',
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          {savedMessage}
        </div>
      )}
      {scheduleMessage && (
        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1e3a8a',
            padding: '12px 14px',
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          {scheduleMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Image uploader */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Character Image</label>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: 12,
              padding: 16,
              textAlign: 'center',
              background: '#fafafa',
            }}
          >
            {imageDataUrl ? (
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={imageDataUrl}
                  alt="Character preview"
                  style={{
                    width: 160,
                    height: 160,
                    objectFit: 'cover',
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                  }}
                />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ marginBottom: 8, color: '#444' }}>Preview loaded.</p>
                  <label
                    htmlFor="character-file"
                    style={{
                      display: 'inline-block',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      cursor: 'pointer',
                      background: '#fff',
                      fontWeight: 600,
                    }}
                  >
                    Change Image
                  </label>
                </div>
              </div>
            ) : (
              <>
                <p style={{ marginBottom: 8, color: '#444' }}>
                  Drag & drop an image here, or click to upload.
                </p>
                <label
                  htmlFor="character-file"
                  style={{
                    display: 'inline-block',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    background: '#fff',
                    fontWeight: 600,
                  }}
                >
                  Choose Image
                </label>
              </>
            )}
            <input
              id="character-file"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
              style={{ display: 'none' }}
            />
          </div>

          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
            Accepted: PNG/JPG · Max 5MB
          </p>
        </div>

        {/* Prompt builder */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>
            Fighter Prompt (200+ chars)
          </label>
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setSavedMessage('');
              setError('');
              setScheduleMessage('');
            }}
            placeholder="Describe your boxer’s style, strengths, weaknesses, entrance, personality, stance, preferred combos, ring IQ, cardio, footwork, defense, mindset under pressure, crowd energy, etc…"
            rows={12}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 10,
              border: '1px solid #d1d5db',
              outline: 'none',
              resize: 'vertical',
              background: '#fff',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 12, color: minReached ? '#065f46' : '#92400e' }}>
              {minReached ? 'Minimum met ✅' : `Need ${Math.max(0, 200 - chars)} more characters`}
            </span>
            <span style={{ fontSize: 12, color: '#6b7280' }}>{chars} / ∞</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
        <button
          onClick={onSave}
          disabled={saving || !imageDataUrl || !minReached}
          style={{
            padding: '12px 18px',
            fontWeight: 700,
            borderRadius: 10,
            border: 'none',
            cursor: saving || !imageDataUrl || !minReached ? 'not-allowed' : 'pointer',
            opacity: saving || !imageDataUrl || !minReached ? 0.6 : 1,
            background: '#2563eb',
            color: '#fff',
          }}
        >
          {saving ? 'Saving…' : 'Save Profile'}
        </button>

        <button
          onClick={() => {
            setImageDataUrl('');
            setPrompt('');
            setSavedMessage('');
            setScheduleMessage('');
            setError('');
            localStorage.removeItem('coachProfile');
          }}
          disabled={saving}
          style={{
            padding: '12px 18px',
            fontWeight: 700,
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            background: '#f3f4f6',
            color: '#111',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          Reset
        </button>

        {/* New mock scheduling button */}
        <button
          onClick={onScheduleNextFight}
          disabled={scheduling}
          style={{
            padding: '12px 18px',
            fontWeight: 700,
            borderRadius: 10,
            border: '1px solid #86efac',
            background: '#dcfce7',
            color: '#065f46',
            cursor: scheduling ? 'not-allowed' : 'pointer',
          }}
          title="We'll notify you when the next fight slot opens (mock)"
        >
          {scheduling ? 'Scheduling…' : 'Schedule Next Fight Available'}
        </button>
      </div>
    </div>
  );
}
