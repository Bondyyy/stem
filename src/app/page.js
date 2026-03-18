'use client';

// src/app/page.js

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/* ─────────────────────────────────────────────
   Inline Google Fonts  (Playfair Display + DM Sans)
   injected once via a <style> tag
───────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --rose:    #e8a0a0;
  --rose-dk: #c97070;
  --blush:   #f7ede8;
  --cream:   #fdf6f0;
  --sage:    #8fac9a;
  --sage-dk: #5e8870;
  --ink:     #2d2420;
  --muted:   #8a7570;
  --white:   #ffffff;
  --radius:  1.25rem;
  --shadow:  0 8px 40px rgba(0,0,0,.10);
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  overflow-x: hidden;
}

body::before, body::after {
  content: '';
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  opacity: .45;
  pointer-events: none;
  z-index: 0;
}
body::before {
  width: 420px; height: 420px;
  background: radial-gradient(circle, #f0c4c4, transparent 70%);
  top: -100px; left: -120px;
}
body::after {
  width: 360px; height: 360px;
  background: radial-gradient(circle, #c4d9cb, transparent 70%);
  bottom: -80px; right: -80px;
}

.card {
  position: relative; z-index: 1;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 460px;
  padding: 2.8rem 2.6rem 2.4rem;
  animation: rise .55s cubic-bezier(.22,.68,0,1.2) both;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(28px) scale(.97); }
  to   { opacity: 1; transform: none; }
}

.brand { text-align: center; margin-bottom: 2.2rem; }
.brand-icon { font-size: 2.4rem; line-height: 1; margin-bottom: .4rem; display: block; }
.brand h1 { font-family: 'Playfair Display', serif; font-size: 1.75rem; color: var(--ink); letter-spacing: -.01em; }
.brand p { font-size: .85rem; color: var(--muted); margin-top: .3rem; font-weight: 300; }

.roles { display: grid; grid-template-columns: 1fr 1fr; gap: .85rem; margin-bottom: 2rem; }
.role-btn {
  display: flex; flex-direction: column; align-items: center;
  gap: .45rem; padding: 1.2rem .75rem;
  border-radius: .9rem; border: 2px solid #ecdbd5;
  background: var(--blush); cursor: pointer; transition: all .2s;
  font-family: 'DM Sans', sans-serif;
}
.role-btn:hover { border-color: var(--rose); transform: translateY(-2px); }
.role-btn.active-mom  { border-color: var(--rose-dk); background: #f9e4e4; box-shadow: 0 0 0 4px rgba(201,112,112,.15); }
.role-btn.active-doc  { border-color: var(--sage-dk); background: #e4f0e8; box-shadow: 0 0 0 4px rgba(94,136,112,.15); }
.role-btn .icon  { font-size: 1.8rem; }
.role-btn .label { font-size: .82rem; font-weight: 500; color: var(--ink); text-align: center; line-height: 1.3; }

.divider {
  display: flex; align-items: center; gap: .75rem;
  margin: 1.5rem 0 1.2rem;
  font-size: .78rem; color: var(--muted);
}
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #ecdbd5; }

.tabs { display: flex; background: var(--blush); border-radius: .65rem; padding: .25rem; margin-bottom: 1.5rem; }
.tab-btn {
  flex: 1; padding: .5rem;
  border: none; background: transparent; border-radius: .45rem;
  font-family: 'DM Sans', sans-serif; font-size: .85rem; font-weight: 500;
  color: var(--muted); cursor: pointer; transition: all .18s;
}
.tab-btn.active-mom { background: var(--rose-dk); color: #fff; }
.tab-btn.active-doc { background: var(--sage-dk); color: #fff; }
.tab-btn:not(.active-mom):not(.active-doc):hover { color: var(--ink); }

.form { display: flex; flex-direction: column; gap: .9rem; }

label { display: flex; flex-direction: column; gap: .35rem; font-size: .8rem; font-weight: 500; color: var(--muted); letter-spacing: .02em; text-transform: uppercase; }

input {
  padding: .7rem .95rem;
  border-radius: .65rem; border: 1.5px solid #ecdbd5;
  background: var(--blush);
  font-family: 'DM Sans', sans-serif; font-size: .95rem; color: var(--ink);
  outline: none; transition: border-color .18s, box-shadow .18s;
}
input::placeholder { color: #c5ada7; }
input:focus { border-color: var(--rose); box-shadow: 0 0 0 3px rgba(201,112,112,.15); }
.doc input:focus { border-color: var(--sage-dk); box-shadow: 0 0 0 3px rgba(94,136,112,.15); }

.btn-submit {
  margin-top: .4rem; padding: .85rem;
  border-radius: .75rem; border: none;
  font-family: 'DM Sans', sans-serif; font-size: .95rem; font-weight: 500;
  cursor: pointer; transition: all .18s; letter-spacing: .01em;
}
.btn-submit.mom { background: var(--rose-dk); color: #fff; }
.btn-submit.mom:hover { background: #b85c5c; transform: translateY(-1px); }
.btn-submit.doc { background: var(--sage-dk); color: #fff; }
.btn-submit.doc:hover { background: #4a7060; transform: translateY(-1px); }
.btn-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }

.msg-error { font-size: .83rem; color: #b94040; background: #fdeaea; border-radius: .5rem; padding: .6rem .85rem; border: 1px solid #f0c0c0; }
.msg-success { font-size: .83rem; color: var(--sage-dk); background: #e8f5ec; border-radius: .5rem; padding: .6rem .85rem; border: 1px solid #b8dcc4; }

.footer-note { margin-top: 1.6rem; text-align: center; font-size: .78rem; color: var(--muted); }
`;

export default function HomePage() {
  const router = useRouter();

  const [role,     setRole]     = useState(null);
  const [mode,     setMode]     = useState('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  function selectRole(r) {
    setRole(r); setMode('login');
    setEmail(''); setPassword(''); setError(''); setSuccess('');
  }
  function selectMode(m) {
    setMode(m); setError(''); setSuccess('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: mode, email, password, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        return;
      }

      const { user } = data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('role', user.role);
        if (user.patient_code) localStorage.setItem('patient_code', user.patient_code);
      }

      setSuccess(mode === 'register' ? 'Đăng ký thành công! Đang chuyển hướng…' : 'Đăng nhập thành công! Đang chuyển hướng…');
      setTimeout(() => {
        router.push(user.role === 'mom' ? '/mom-dashboard' : '/doctor-dashboard');
      }, 900);

    } catch {
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  }

  const isMom = role === 'mom';
  const isDoc = role === 'doctor';
  const accentRole = isMom ? 'mom' : 'doc';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="card">
        <div className="brand">
          <span className="brand-icon">🌸</span>
          <h1>MamaTrack</h1>
          <p>Đồng hành cùng hành trình thai kỳ của bạn</p>
        </div>

        <div className="roles">
          <button
            type="button"
            className={`role-btn${isMom ? ' active-mom' : ''}`}
            onClick={() => selectRole('mom')}
          >
            <span className="icon">🤰</span>
            <span className="label">Tôi là<br />Bà bầu</span>
          </button>
          <button
            type="button"
            className={`role-btn${isDoc ? ' active-doc' : ''}`}
            onClick={() => selectRole('doctor')}
          >
            <span className="icon">👨‍⚕️</span>
            <span className="label">Tôi là<br />Bác sĩ</span>
          </button>
        </div>

        {role && (
          <>
            <div className="divider">
              Tiếp tục với vai trò {isMom ? 'Bà bầu' : 'Bác sĩ'}
            </div>

            <div className="tabs">
              <button
                type="button"
                className={`tab-btn${mode === 'login' ? ` active-${accentRole}` : ''}`}
                onClick={() => selectMode('login')}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                className={`tab-btn${mode === 'register' ? ` active-${accentRole}` : ''}`}
                onClick={() => selectMode('register')}
              >
                Đăng ký
              </button>
            </div>

            <form className={`form${isDoc ? ' doc' : ''}`} onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  type="email" required
                  placeholder="email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </label>

              <label>
                Mật khẩu
                <input
                  type="password" required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </label>

              {error   && <p className="msg-error">{error}</p>}
              {success && <p className="msg-success">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`btn-submit ${accentRole}`}
              >
                {loading
                  ? 'Đang xử lý…'
                  : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
              </button>
            </form>
          </>
        )}

        {!role && (
          <p className="footer-note">Chọn vai trò để bắt đầu →</p>
        )}
      </div>
    </>
  );
}