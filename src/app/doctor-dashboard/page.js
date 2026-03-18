'use client';

// src/app/doctor-dashboard/page.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Dot,
} from 'recharts';

/* ── Styles ─────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --sage:       #8fac9a;
  --sage-dk:    #5e8870;
  --sage-xdk:   #3d6652;
  --sage-lt:    #e4f0e8;
  --cream:      #f4f8f5;
  --blush-sage: #eaf3ee;
  --ink:        #1e2d26;
  --ink-lt:     #4a5e54;
  --muted:      #7a9080;
  --border:     #cde0d5;
  --white:      #ffffff;
  --rose:       #c97070;
  --radius-sm:  .65rem;
  --radius-md:  1rem;
  --radius-lg:  1.4rem;
  --shadow-sm:  0 2px 12px rgba(0,0,0,.07);
  --shadow-md:  0 8px 36px rgba(0,0,0,.10);
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  min-height: 100vh;
  color: var(--ink);
}

::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

/* ── Nav ── */
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
  font-size: 1.3rem; color: var(--sage-dk);
  display: flex; align-items: center; gap: .5rem;
}
.role-badge {
  font-size: .75rem; font-weight: 500;
  background: var(--sage-lt); color: var(--sage-xdk);
  padding: .28rem .8rem; border-radius: 99px;
  border: 1px solid var(--sage);
}
.btn-logout {
  font-size: .8rem; font-weight: 500;
  background: transparent; border: 1px solid var(--border);
  color: var(--muted); padding: .3rem .85rem;
  border-radius: 99px; cursor: pointer; transition: all .18s;
}
.btn-logout:hover { background: var(--sage-lt); color: var(--sage-dk); border-color: var(--sage); }

/* ── Page ── */
.page { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem; }

/* ── Search bar ── */
.search-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.75rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.5rem;
  display: flex; flex-direction: column; gap: .75rem;
}
.search-label {
  font-size: .8rem; font-weight: 500;
  color: var(--muted); letter-spacing: .06em; text-transform: uppercase;
}
.search-row { display: flex; gap: .75rem; }
.search-input {
  flex: 1; padding: .75rem 1.1rem;
  border-radius: var(--radius-sm); border: 1.5px solid var(--border);
  background: var(--blush-sage);
  font-family: 'DM Sans', sans-serif; font-size: .95rem; color: var(--ink);
  outline: none; transition: all .18s; letter-spacing: .05em; text-transform: uppercase;
}
.search-input::placeholder { color: #a0bfae; text-transform: none; letter-spacing: 0; }
.search-input:focus {
  border-color: var(--sage-dk); background: var(--white);
  box-shadow: 0 0 0 3px rgba(94,136,112,.15);
}
.btn-search {
  padding: .75rem 1.6rem;
  border-radius: var(--radius-sm); border: none;
  background: var(--sage-dk); color: var(--white);
  font-family: 'DM Sans', sans-serif; font-size: .92rem; font-weight: 500;
  cursor: pointer; transition: all .18s; white-space: nowrap;
  display: flex; align-items: center; gap: .5rem;
}
.btn-search:hover:not(:disabled) { background: var(--sage-xdk); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(61,102,82,.25); }
.btn-search:disabled { opacity: .55; cursor: not-allowed; transform: none; }

/* ── Card shared ── */
.card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: 1.5rem;
  animation: slideUp .35s cubic-bezier(.22,.68,0,1.2) both;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
.card-header {
  padding: 1.1rem 1.5rem .9rem;
  border-bottom: 1px solid var(--border);
  background: var(--blush-sage);
  display: flex; align-items: center; justify-content: space-between;
}
.card-title { font-family: 'Playfair Display', serif; font-size: 1.08rem; color: var(--ink); }
.card-sub   { font-size: .78rem; color: var(--muted); margin-top: .15rem; }

/* ── Chart ── */
.chart-wrap { padding: 1.25rem 1rem 1rem; }

/* ── Stat row above chart ── */
.stat-row {
  display: flex; gap: 1rem; flex-wrap: wrap;
  padding: 0 1.5rem 1rem;
}
.stat-box {
  flex: 1; min-width: 110px;
  background: var(--blush-sage); border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: .75rem 1rem;
}
.stat-label { font-size: .72rem; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; }
.stat-value { font-size: 1.25rem; font-weight: 500; color: var(--sage-xdk); margin-top: .15rem; }
.stat-unit  { font-size: .75rem; color: var(--muted); font-weight: 400; }

/* ── Custom tooltip ── */
.chart-tooltip {
  background: var(--white); border: 1px solid var(--border);
  border-radius: .6rem; padding: .6rem .9rem;
  box-shadow: var(--shadow-md);
  font-size: .82rem; color: var(--ink);
}
.chart-tooltip .tt-week { font-weight: 500; color: var(--sage-dk); margin-bottom: .25rem; }

/* ── Table ── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: .855rem; }
thead th {
  background: var(--blush-sage); color: var(--muted);
  font-weight: 500; font-size: .75rem; letter-spacing: .06em; text-transform: uppercase;
  padding: .65rem 1.2rem; text-align: left; position: sticky; top: 0;
}
tbody tr { border-bottom: 1px solid var(--border); transition: background .12s; }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: var(--sage-lt); }
tbody td { padding: .75rem 1.2rem; color: var(--ink-lt); vertical-align: middle; }
.td-week { font-weight: 500; color: var(--sage-dk); font-size: 1rem; }
.tag {
  display: inline-block; background: var(--sage-lt); color: var(--sage-xdk);
  border: 1px solid var(--sage); border-radius: 6px;
  padding: .15rem .55rem; font-size: .76rem;
  max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.bp-pill {
  display: inline-block; background: #fff4e6; color: #9a6200;
  border: 1px solid #f0c875; border-radius: 99px;
  padding: .15rem .6rem; font-size: .78rem; font-weight: 500;
}

/* ── Empty / error states ── */
.state-box {
  text-align: center; padding: 3.5rem 1.5rem;
}
.state-icon { font-size: 2.8rem; opacity: .45; margin-bottom: .7rem; display: block; }
.state-title { font-size: 1rem; font-weight: 500; color: var(--ink-lt); }
.state-sub   { font-size: .85rem; color: var(--muted); margin-top: .35rem; }

.empty-idle   .state-title { color: var(--muted); }
.error-state  .state-title { color: #b94040; }
.error-state  .state-icon  { opacity: 1; }

/* ── Loading skeleton ── */
.skeleton-cell {
  height: 13px; border-radius: 6px;
  background: linear-gradient(90deg, var(--blush-sage) 25%, var(--border) 50%, var(--blush-sage) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite;
}
@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
`;

/* ── Custom recharts tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tt-week">Tuần {label}</div>
      <div>Cân nặng: <strong>{payload[0].value} kg</strong></div>
    </div>
  );
}

/* ── Custom dot ── */
function CustomDot(props) {
  const { cx, cy, value } = props;
  if (!value) return null;
  return (
    <circle cx={cx} cy={cy} r={5} fill="#5e8870" stroke="#fff" strokeWidth={2} />
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────── */
export default function DoctorDashboard() {
  const router = useRouter();

  const [query,    setQuery]    = useState('');
  const [searched, setSearched] = useState('');   // code actually searched
  const [records,  setRecords]  = useState(null); // null = not searched yet
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  function handleLogout() {
    localStorage.removeItem('role');
    localStorage.removeItem('patient_code');
    router.push('/');
  }

  async function handleSearch(e) {
    e?.preventDefault();
    const code = query.trim().toUpperCase();
    if (!code) return;

    setLoading(true); setError(''); setRecords(null); setSearched(code);

    try {
      const res  = await fetch(`/api/records?patient_code=${encodeURIComponent(code)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Lỗi máy chủ.');
        return;
      }
      setRecords(data.records ?? []);
    } catch {
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  }

  /* ── derived stats ── */
  const weights       = records?.map(r => r.weight).filter(Boolean) ?? [];
  const minW          = weights.length ? Math.min(...weights) : null;
  const maxW          = weights.length ? Math.max(...weights) : null;
  const latestW       = weights.at(-1) ?? null;
  const totalWeeks    = records?.length ?? 0;

  const chartData     = records?.map(r => ({
    week:   r.week,
    weight: r.weight ?? null,
  })) ?? [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Nav ── */}
      <nav className="nav">
        <div className="nav-brand">
          <span>🩺</span> MamaTrack
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
          <span className="role-badge">Bác sĩ</span>
          <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </nav>

      <main className="page">

        {/* ── Search ── */}
        <div className="search-card">
          <label className="search-label">Tra cứu hồ sơ bệnh nhân</label>
          <form className="search-row" onSubmit={handleSearch}>
            <input
              className="search-input"
              type="text"
              placeholder="Nhập mã bệnh nhân — VD: BN4721"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="btn-search" type="submit" disabled={loading || !query.trim()}>
              {loading ? '⏳ Đang tìm…' : '🔍 Tìm kiếm'}
            </button>
          </form>
        </div>

        {/* ── States ── */}

        {/* idle */}
        {records === null && !loading && !error && (
          <div className="card">
            <div className="state-box empty-idle">
              <span className="state-icon">🗂️</span>
              <div className="state-title">Nhập mã bệnh nhân để bắt đầu tra cứu</div>
              <div className="state-sub">Hệ thống sẽ hiển thị biểu đồ và lịch sử thai kỳ</div>
            </div>
          </div>
        )}

        {/* loading skeleton */}
        {loading && (
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Đang tải dữ liệu…</div>
                <div className="card-sub">Mã: {searched}</div>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '.85rem' }}>
                  {[60, 90, 80, 130].map((w, j) => (
                    <div key={j} className="skeleton-cell" style={{ width: w, flexShrink: 0 }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* error */}
        {error && (
          <div className="card">
            <div className="state-box error-state">
              <span className="state-icon">⚠️</span>
              <div className="state-title">Không tìm thấy dữ liệu</div>
              <div className="state-sub">Mã <strong>{searched}</strong> chưa có hồ sơ hoặc chưa nhập liệu.</div>
            </div>
          </div>
        )}

        {/* no records */}
        {!loading && !error && records !== null && records.length === 0 && (
          <div className="card">
            <div className="state-box">
              <span className="state-icon">📭</span>
              <div className="state-title">Chưa có dữ liệu thai kỳ</div>
              <div className="state-sub">Bệnh nhân <strong>{searched}</strong> chưa nhập liệu tuần nào.</div>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {!loading && !error && records !== null && records.length > 0 && (
          <>
            {/* Stat strip */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <div>
                  <div className="card-title">Hồ sơ: {searched}</div>
                  <div className="card-sub">Theo dõi {totalWeeks} tuần thai kỳ</div>
                </div>
                <span style={{ fontSize: '.8rem', fontWeight: 500, background: 'var(--sage-dk)', color: '#fff', padding: '.25rem .75rem', borderRadius: 99 }}>
                  Tuần {records.at(-1).week}
                </span>
              </div>
              <div className="stat-row">
                <div className="stat-box">
                  <div className="stat-label">Cân nặng hiện tại</div>
                  <div className="stat-value">{latestW ?? '—'} <span className="stat-unit">kg</span></div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Thấp nhất</div>
                  <div className="stat-value">{minW ?? '—'} <span className="stat-unit">kg</span></div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Cao nhất</div>
                  <div className="stat-value">{maxW ?? '—'} <span className="stat-unit">kg</span></div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Tăng cân</div>
                  <div className="stat-value">
                    {minW && latestW ? `+${(latestW - minW).toFixed(1)}` : '—'}
                    <span className="stat-unit"> kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line chart */}
            {weights.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Biểu đồ cân nặng theo tuần</div>
                    <div className="card-sub">Đơn vị: kg</div>
                  </div>
                </div>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={chartData} margin={{ top: 10, right: 24, left: -10, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 4" stroke="#cde0d5" vertical={false} />
                      <XAxis
                        dataKey="week"
                        tick={{ fontSize: 12, fill: '#7a9080', fontFamily: 'DM Sans, sans-serif' }}
                        tickLine={false} axisLine={false}
                        label={{ value: 'Tuần', position: 'insideRight', offset: 10, fontSize: 12, fill: '#7a9080' }}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#7a9080', fontFamily: 'DM Sans, sans-serif' }}
                        tickLine={false} axisLine={false}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone" dataKey="weight"
                        stroke="#5e8870" strokeWidth={2.5}
                        dot={<CustomDot />}
                        activeDot={{ r: 7, fill: '#5e8870', stroke: '#fff', strokeWidth: 2 }}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Detail table */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Chi tiết từng tuần</div>
                  <div className="card-sub">{totalWeeks} bản ghi</div>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Tuần</th>
                      <th>Cân nặng (kg)</th>
                      <th>Huyết áp</th>
                      <th>Triệu chứng / Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(r => (
                      <tr key={r.id}>
                        <td className="td-week">{r.week}</td>
                        <td>
                          {r.weight
                            ? <strong style={{ color: 'var(--sage-dk)' }}>{r.weight}</strong>
                            : <span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>—</span>
                          }
                        </td>
                        <td>
                          {r.blood_pressure
                            ? <span className="bp-pill">{r.blood_pressure}</span>
                            : <span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>—</span>
                          }
                        </td>
                        <td>
                          {r.symptoms
                            ? <span className="tag" title={r.symptoms}>{r.symptoms}</span>
                            : <span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>—</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}