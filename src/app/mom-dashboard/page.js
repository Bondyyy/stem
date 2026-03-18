'use client';

// src/app/mom-dashboard/page.js

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* ── Styles ─────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --rose:      #e8a0a0;
  --rose-dk:   #c97070;
  --rose-xdk:  #a85555;
  --blush:     #f7ede8;
  --blush-dk:  #f0ddd5;
  --cream:     #fdf6f0;
  --sage:      #8fac9a;
  --sage-dk:   #5e8870;
  --ink:       #2d2420;
  --ink-lt:    #5a4540;
  --muted:     #8a7570;
  --border:    #ecdbd5;
  --white:     #ffffff;
  --radius-sm: .65rem;
  --radius-md: 1rem;
  --radius-lg: 1.4rem;
  --shadow-sm: 0 2px 12px rgba(0,0,0,.07);
  --shadow-md: 0 8px 36px rgba(0,0,0,.10);
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  min-height: 100vh;
  color: var(--ink);
}

/* scrollbar */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

/* ── Top nav ── */
.nav {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: .85rem 2rem;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 10;
  box-shadow: var(--shadow-sm);
}
.nav-brand {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem; color: var(--rose-dk);
  display: flex; align-items: center; gap: .45rem;
}
.nav-right {
  display: flex; align-items: center; gap: .85rem;
}
.patient-badge {
  font-size: .78rem; font-weight: 500;
  background: var(--blush); color: var(--rose-xdk);
  padding: .3rem .8rem; border-radius: 99px;
  border: 1px solid var(--rose);
  letter-spacing: .03em;
}
.btn-logout {
  font-size: .8rem; font-weight: 500;
  background: transparent; border: 1px solid var(--border);
  color: var(--muted); padding: .3rem .85rem;
  border-radius: 99px; cursor: pointer;
  transition: all .18s;
}
.btn-logout:hover { background: var(--blush); color: var(--rose-dk); border-color: var(--rose); }

/* ── Page layout ── */
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 780px) {
  .page { grid-template-columns: 1fr; }
}

/* ── Cards ── */
.card {
  background: var(--white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
.card-header {
  padding: 1.2rem 1.5rem .9rem;
  border-bottom: 1px solid var(--border);
  background: var(--blush);
  display: flex; align-items: center; justify-content: space-between;
}
.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem; color: var(--ink);
}
.card-subtitle {
  font-size: .78rem; color: var(--muted); margin-top: .15rem;
}
.week-chip {
  font-size: .75rem; font-weight: 500;
  background: var(--rose-dk); color: #fff;
  padding: .25rem .7rem; border-radius: 99px;
}

/* ── History table ── */
.table-wrap { overflow-x: auto; }
table {
  width: 100%; border-collapse: collapse;
  font-size: .855rem;
}
thead th {
  background: var(--blush-dk);
  color: var(--muted);
  font-weight: 500; font-size: .75rem; letter-spacing: .06em; text-transform: uppercase;
  padding: .65rem 1rem; text-align: left;
  position: sticky; top: 0;
}
tbody tr { border-bottom: 1px solid var(--border); transition: background .12s; }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: var(--blush); }
tbody td { padding: .7rem 1rem; color: var(--ink-lt); vertical-align: middle; }
td.week-cell {
  font-weight: 500; color: var(--rose-dk);
  font-size: 1rem;
}
.empty-state {
  padding: 3rem 1.5rem; text-align: center;
  color: var(--muted); font-size: .9rem;
}
.empty-icon { font-size: 2.5rem; margin-bottom: .6rem; display: block; opacity: .5; }

/* symptom tag */
.symptom-tag {
  display: inline-block;
  background: var(--blush); color: var(--rose-xdk);
  border: 1px solid var(--rose);
  border-radius: 6px; padding: .15rem .5rem;
  font-size: .75rem; max-width: 160px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* ── Form ── */
.form-body { padding: 1.4rem 1.5rem; }
.form { display: flex; flex-direction: column; gap: 1.05rem; }

.field { display: flex; flex-direction: column; gap: .35rem; }
.field label {
  font-size: .75rem; font-weight: 500;
  color: var(--muted); letter-spacing: .05em; text-transform: uppercase;
}

.input-wrap { position: relative; }
input, textarea {
  width: 100%;
  padding: .7rem .95rem;
  border-radius: var(--radius-sm); border: 1.5px solid var(--border);
  background: var(--blush);
  font-family: 'DM Sans', sans-serif; font-size: .93rem; color: var(--ink);
  outline: none; transition: border-color .18s, box-shadow .18s;
}
textarea { resize: vertical; min-height: 80px; }
input::placeholder, textarea::placeholder { color: #c5ada7; }
input:focus, textarea:focus {
  border-color: var(--rose-dk); background: #fff;
  box-shadow: 0 0 0 3px rgba(201,112,112,.14);
}
input:disabled {
  background: var(--blush-dk); color: var(--rose-xdk);
  font-weight: 500; cursor: not-allowed;
  border-color: var(--rose);
}
.lock-icon {
  position: absolute; right: .75rem; top: 50%; transform: translateY(-50%);
  font-size: .85rem; color: var(--rose);
  pointer-events: none;
}

.hint { font-size: .75rem; color: var(--muted); margin-top: -.2rem; }

/* ── Submit btn ── */
.btn-submit {
  padding: .85rem;
  border-radius: var(--radius-sm); border: none;
  background: var(--rose-dk); color: #fff;
  font-family: 'DM Sans', sans-serif; font-size: .95rem; font-weight: 500;
  cursor: pointer; transition: all .18s; letter-spacing: .01em;
  display: flex; align-items: center; justify-content: center; gap: .5rem;
}
.btn-submit:hover:not(:disabled) { background: var(--rose-xdk); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(169,85,85,.25); }
.btn-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; }

/* ── Messages ── */
.msg {
  font-size: .83rem; padding: .6rem .9rem;
  border-radius: .5rem; margin-top: .2rem;
}
.msg-error   { color: #b94040; background: #fdeaea; border: 1px solid #f0c0c0; }
.msg-success { color: var(--sage-dk); background: #e8f5ec; border: 1px solid #b8dcc4; }

/* ── Loading skeleton ── */
.skeleton-row td { padding: .7rem 1rem; }
.skeleton-cell {
  height: 14px; border-radius: 6px;
  background: linear-gradient(90deg, var(--blush) 25%, var(--blush-dk) 50%, var(--blush) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}

/* ── Fade-in for new rows ── */
@keyframes fadeIn {
  from { opacity: 0; background: var(--blush); }
  to   { opacity: 1; background: transparent; }
}
.row-new { animation: fadeIn .6s ease both; }
`;

/* ─────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────── */
export default function MomDashboard() {
  const router = useRouter();

  const [patientCode, setPatientCode] = useState('');
  const [records,     setRecords]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [newRowId,    setNewRowId]    = useState(null);

  // form state
  const [weight,         setWeight]         = useState('');
  const [bloodPressure,  setBloodPressure]  = useState('');
  const [symptoms,       setSymptoms]       = useState('');
  const [submitting,     setSubmitting]     = useState(false);
  const [formError,      setFormError]      = useState('');
  const [formSuccess,    setFormSuccess]    = useState('');

  /* ── next week to fill ── */
  const maxWeek    = records.length > 0 ? Math.max(...records.map(r => r.week)) : 0;
  const nextWeek   = maxWeek + 1;

  /* ── fetch records ── */
  const fetchRecords = useCallback(async (code) => {
    try {
      const res  = await fetch(`/api/records?patient_code=${code}`);
      const data = await res.json();
      if (res.ok) setRecords(data.records ?? []);
    } catch {
      /* silently fail — records stay empty */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const code = localStorage.getItem('patient_code');
    if (!code) { router.push('/'); return; }
    setPatientCode(code);
    fetchRecords(code);
  }, [fetchRecords, router]);

  /* ── submit new record ── */
  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(''); setFormSuccess(''); setSubmitting(true);

    try {
      const res  = await fetch('/api/records', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          patient_code:   patientCode,
          week:           nextWeek,
          weight:         weight         ? parseFloat(weight)  : null,
          blood_pressure: bloodPressure  || null,
          symptoms:       symptoms       || null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        return;
      }

      const saved = data.record;
      setRecords(prev => [...prev, saved]);
      setNewRowId(saved.id);
      setTimeout(() => setNewRowId(null), 1200);

      setFormSuccess(`✓ Đã lưu dữ liệu Tuần ${saved.week} thành công!`);
      setWeight(''); setBloodPressure(''); setSymptoms('');
      setTimeout(() => setFormSuccess(''), 3500);

    } catch {
      setFormError('Không thể kết nối đến máy chủ.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('patient_code');
    localStorage.removeItem('role');
    router.push('/');
  }

  /* ── Skeleton rows while loading ── */
  const skeletonRows = Array.from({ length: 4 });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Nav ── */}
      <nav className="nav">
        <div className="nav-brand">
          <span>🌸</span> MamaTrack
        </div>
        <div className="nav-right">
          {patientCode && (
            <span className="patient-badge">Mã: {patientCode}</span>
          )}
          <button className="btn-logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </nav>

      {/* ── Two-column layout ── */}
      <main className="page">

        {/* ── LEFT: History table ── */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Lịch sử thai kỳ</div>
              <div className="card-subtitle">
                {loading ? 'Đang tải…' : `${records.length} tuần đã ghi nhận`}
              </div>
            </div>
            {!loading && records.length > 0 && (
              <span className="week-chip">Tuần {maxWeek}</span>
            )}
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tuần</th>
                  <th>Cân nặng (kg)</th>
                  <th>Huyết áp</th>
                  <th>Triệu chứng</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  skeletonRows.map((_, i) => (
                    <tr key={i} className="skeleton-row">
                      {[40, 80, 70, 120].map((w, j) => (
                        <td key={j}>
                          <div className="skeleton-cell" style={{ width: w }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty-state">
                        <span className="empty-icon">📋</span>
                        Chưa có dữ liệu. Hãy nhập tuần đầu tiên!
                      </div>
                    </td>
                  </tr>
                ) : (
                  records.map(r => (
                    <tr key={r.id} className={r.id === newRowId ? 'row-new' : ''}>
                      <td className="week-cell">{r.week}</td>
                      <td>{r.weight ?? <span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>—</span>}</td>
                      <td>{r.blood_pressure ?? <span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>—</span>}</td>
                      <td>
                        {r.symptoms
                          ? <span className="symptom-tag" title={r.symptoms}>{r.symptoms}</span>
                          : <span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>—</span>
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── RIGHT: Input form ── */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Nhập liệu mới</div>
              <div className="card-subtitle">
                {loading ? '…' : `Tiếp theo: Tuần ${nextWeek}`}
              </div>
            </div>
            <span style={{ fontSize: '1.5rem' }}>🩺</span>
          </div>

          <div className="form-body">
            <form className="form" onSubmit={handleSubmit}>

              {/* Tuần thai — locked */}
              <div className="field">
                <label>Tuần thai</label>
                <div className="input-wrap">
                  <input
                    type="number"
                    value={loading ? '' : nextWeek}
                    disabled
                    readOnly
                    placeholder="Đang tải…"
                  />
                  <span className="lock-icon">🔒</span>
                </div>
                <span className="hint">Tự động tính từ lần nhập trước</span>
              </div>

              {/* Cân nặng */}
              <div className="field">
                <label>Cân nặng (kg)</label>
                <input
                  type="number" step="0.1" min="30" max="200"
                  placeholder="VD: 56.5"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                />
              </div>

              {/* Huyết áp */}
              <div className="field">
                <label>Huyết áp</label>
                <input
                  type="text"
                  placeholder="VD: 110/70"
                  value={bloodPressure}
                  onChange={e => setBloodPressure(e.target.value)}
                />
              </div>

              {/* Triệu chứng */}
              <div className="field">
                <label>Triệu chứng / Ghi chú</label>
                <textarea
                  placeholder="VD: Buồn nôn nhẹ, mệt mỏi…"
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                />
              </div>

              {formError   && <p className="msg msg-error">{formError}</p>}
              {formSuccess && <p className="msg msg-success">{formSuccess}</p>}

              <button
                type="submit"
                className="btn-submit"
                disabled={submitting || loading}
              >
                {submitting ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin .8s linear infinite' }}>⏳</span>
                    Đang lưu…
                  </>
                ) : (
                  <>💾 Lưu tuần {loading ? '…' : nextWeek}</>
                )}
              </button>
            </form>
          </div>
        </div>

      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}