'use client';

// src/app/doctor-dashboard/page.js

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { Trash2 } from 'lucide-react';
import { css } from './styles';

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

export default function DoctorDashboard() {
  const router = useRouter();

  const [query,    setQuery]    = useState('');
  const [searched, setSearched] = useState('');
  const [records,  setRecords]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // ── Patients ──
  const [doctorEmail,    setDoctorEmail]    = useState('');
  const [patients,       setPatients]       = useState([]);
  const [patientInput,   setPatientInput]   = useState('');
  const [patientMsg,     setPatientMsg]     = useState('');
  const [patientSearch,  setPatientSearch]  = useState('');

  // ── Appointments ──
  const [apptCode,   setApptCode]   = useState('');
  const [apptTitle,  setApptTitle]  = useState('');
  const [apptDate,   setApptDate]   = useState('');
  const [apptTime,   setApptTime]   = useState('');
  const [apptLoc,    setApptLoc]    = useState('');
  const [apptMsg,    setApptMsg]    = useState('');
  const [apptSaving, setApptSaving] = useState(false);

  /* ── fetch patients ── */
  const fetchPatients = useCallback(async (email) => {
    try {
      const res  = await fetch(`/api/patients?doctor_email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok) setPatients(data.patients ?? []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) { router.push('/'); return; }
    setDoctorEmail(email);
    fetchPatients(email);
  }, [fetchPatients, router]);

  function handleLogout() {
    localStorage.removeItem('role');
    localStorage.removeItem('patient_code');
    localStorage.removeItem('email');
    router.push('/');
  }

  /* ── add patient ── */
  async function handleAddPatient(e) {
    e.preventDefault();
    const code = patientInput.trim().toUpperCase();
    if (!code) return;
    setPatientMsg('');
    try {
      const res = await fetch('/api/patients', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor_email: doctorEmail, patient_code: code }),
      });
      const data = await res.json();
      if (!res.ok) { setPatientMsg(data.error); return; }
      setPatientInput('');
      setPatientMsg('✓ Đã thêm bệnh nhân.');
      fetchPatients(doctorEmail);
      setTimeout(() => setPatientMsg(''), 3000);
    } catch { setPatientMsg('Không thể kết nối máy chủ.'); }
  }

  /* ── delete patient ── */
  async function handleDeletePatient(code) {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này khỏi danh sách quản lý?')) return;
    try {
      const res = await fetch('/api/patients', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor_email: doctorEmail, patient_code: code }),
      });
      if (res.ok) setPatients(prev => prev.filter(p => p.patient_code !== code));
    } catch { /* silent */ }
  }

  /* ── create appointment ── */
  async function handleCreateAppointment(e) {
    e.preventDefault();
    if (!apptCode || !apptTitle || !apptDate || !apptTime) return;
    setApptSaving(true); setApptMsg('');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_code: apptCode.trim().toUpperCase(),
          title: apptTitle, appointment_date: apptDate,
          appointment_time: apptTime, location: apptLoc || null,
          created_by: doctorEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setApptMsg(data.error); return; }
      setApptMsg('✓ Đã tạo lịch khám thành công.');
      setApptCode(''); setApptTitle(''); setApptDate(''); setApptTime(''); setApptLoc('');
      setTimeout(() => setApptMsg(''), 4000);
    } catch { setApptMsg('Không thể kết nối máy chủ.'); }
    finally { setApptSaving(false); }
  }

  /* ── filtered patients (realtime search) ── */
  const filteredPatients = patientSearch
    ? patients.filter(p => p.patient_code.toLowerCase().includes(patientSearch.toLowerCase()))
    : patients;

  async function handleSearch(e, codeOverride) {
    e?.preventDefault();
    const code = (codeOverride || query).trim().toUpperCase();
    if (!code) return;

    if (codeOverride) setQuery(code);

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
        <div className="full-width" style={{ marginBottom: '0.5rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: 'var(--sage-dk)', marginBottom: '.5rem' }}>Bảng điều khiển bác sĩ</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem' }}>Theo dõi hồ sơ thai kỳ và lịch khám của bệnh nhân</p>
        </div>

        {/* ── TRÁI: Quản lý bệnh nhân ── */}
        <div className="left-col" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* ── Search ── */}
          <div className="search-card" style={{ marginBottom: 0 }}>
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
                {loading ? '⏳' : '🔍 Tìm'}
              </button>
            </form>
          </div>

          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <div>
                <div className="card-title">Quản lý bệnh nhân</div>
                <div className="card-sub">{patients.length} bệnh nhân đang quản lý</div>
              </div>
            </div>
            <div className="form-body" style={{ paddingBottom: '1rem' }}>
              <form className="form" onSubmit={handleAddPatient} style={{ flexDirection: 'row', gap: '.6rem', flexWrap: 'wrap' }}>
                <div className="field" style={{ flex: '1 1 140px' }}>
                  <input type="text" placeholder="Thêm mã (VD: BN4721)" value={patientInput} onChange={e => setPatientInput(e.target.value)} style={{ textTransform: 'uppercase', letterSpacing: '.04em' }} />
                </div>
                <button type="submit" className="btn-submit" disabled={!patientInput.trim()} style={{ padding: '.7rem 1.2rem', flex: '0 0 auto' }}>➕ Thêm</button>
              </form>
              {patientMsg && <p className={`msg ${patientMsg.startsWith('✓') ? 'msg-success' : 'msg-error'}`}>{patientMsg}</p>}
              {patients.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <input type="text" placeholder="🔍 Tìm trong danh sách..." value={patientSearch} onChange={e => setPatientSearch(e.target.value)} style={{ textTransform: 'uppercase', letterSpacing: '.04em' }} />
                </div>
              )}
            </div>
            {filteredPatients.length === 0 ? (
              <div className="empty-state"><span className="empty-icon">👥</span><p>{patients.length === 0 ? 'Chưa có bệnh nhân nào.' : 'Không tìm thấy kết quả.'}</p></div>
            ) : (
              <div>
                {filteredPatients.map(p => (
                  <div 
                    key={p.patient_code} 
                    className="patient-item"
                    onClick={() => handleSearch(null, p.patient_code)}
                    style={{ cursor: 'pointer', background: searched === p.patient_code ? 'var(--sage-lt)' : '' }}
                  >
                    <div>
                      <div className="patient-code">{p.patient_code}</div>
                      {p.patient_email && <div className="patient-email">{p.patient_email}</div>}
                    </div>
                    <button 
                      className="act-btn act-del" 
                      title="Xóa" 
                      onClick={(e) => { e.stopPropagation(); handleDeletePatient(p.patient_code); }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── PHẢI: Hồ sơ bệnh nhân ── */}
        <div className="right-col" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* idle */}
          {records === null && !loading && !error && (
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="state-box empty-idle">
                <span className="state-icon">🗂️</span>
                <div className="state-title">Chọn một bệnh nhân để xem biểu đồ và lịch sử thai kỳ</div>
                <div className="state-sub">Hồ sơ sẽ hiển thị tại đây</div>
              </div>
            </div>
          )}

          {/* loading skeleton */}
          {loading && (
            <div className="card" style={{ marginBottom: 0 }}>
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
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="state-box error-state">
                <span className="state-icon">⚠️</span>
                <div className="state-title">Không tìm thấy dữ liệu</div>
                <div className="state-sub">Mã <strong>{searched}</strong> chưa có hồ sơ hoặc chưa nhập liệu.</div>
              </div>
            </div>
          )}

          {/* no records */}
          {!loading && !error && records !== null && records.length === 0 && (
            <div className="card" style={{ marginBottom: 0 }}>
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
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
                  <div>
                    <div className="card-title">Hồ sơ: {searched}</div>
                    <div className="card-sub">Theo dõi {totalWeeks} tuần thai kỳ</div>
                  </div>
                  <span style={{ fontSize: '.85rem', fontWeight: 600, background: 'var(--sage-dk)', color: '#fff', padding: '.3rem .8rem', borderRadius: 99 }}>
                    Tuần {records.at(-1).week}
                  </span>
                </div>
                <div className="stat-row">
                  <div className="stat-box">
                    <div className="stat-label">Cân nặng gần nhất</div>
                    <div className="stat-value">{latestW ?? '—'} <span className="stat-unit">kg</span></div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Huyết áp gần nhất</div>
                    <div className="stat-value">{records.at(-1).blood_pressure ?? '—'}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-label">Tâm trạng gần nhất</div>
                    <div className="stat-value">{records.at(-1).mood ?? '—'}</div>
                  </div>
                </div>
              </div>

              {/* Line chart */}
              {weights.length > 0 && (
                <div className="card" style={{ marginBottom: 0 }}>
                  <div className="card-header">
                    <div>
                      <div className="card-title">Biểu đồ cân nặng</div>
                      <div className="card-sub">Theo dõi cân nặng qua từng tuần (kg)</div>
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
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="card-header">
                  <div>
                    <div className="card-title">Lịch sử khám</div>
                    <div className="card-sub">{totalWeeks} bản ghi chi tiết</div>
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Tuần</th>
                        <th>Cân nặng (kg)</th>
                        <th>Huyết áp</th>
                        <th>Ghi chú</th>
                        <th>Tâm trạng</th>
                        <th>Thai máy</th>
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
                          <td>
                            {r.mood
                              ? <span className="tag" title={r.mood}>{r.mood}</span>
                              : <span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>—</span>
                            }
                          </td>
                          <td>
                            {r.fetal_movement
                              ? <span className="tag" title={r.fetal_movement}>{r.fetal_movement}</span>
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

          {/* ── Lên lịch khám ── */}
          {records !== null && !error && (
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header">
                <div>
                  <div className="card-title">Lên lịch khám</div>
                  <div className="card-sub">Tạo lịch hẹn cho bệnh nhân {searched}</div>
                </div>
              </div>
              <div className="form-body">
                <form className="form" onSubmit={handleCreateAppointment}>
                  <div className="field">
                    <label>Mã bệnh nhân</label>
                    <input type="text" placeholder="VD: BN4721" value={apptCode} onChange={e => setApptCode(e.target.value)} style={{ textTransform: 'uppercase', letterSpacing: '.04em' }} />
                  </div>
                  <div className="field">
                    <label>Tên lịch khám</label>
                    <input type="text" placeholder="VD: Khám thai định kỳ" value={apptTitle} onChange={e => setApptTitle(e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="field">
                      <label>Ngày khám</label>
                      <input type="date" value={apptDate} onChange={e => setApptDate(e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Giờ khám</label>
                      <input type="time" value={apptTime} onChange={e => setApptTime(e.target.value)} />
                    </div>
                  </div>
                  <div className="field">
                    <label>Địa điểm khám</label>
                    <input type="text" placeholder="VD: Bệnh viện Đa khoa Bình Dương" value={apptLoc} onChange={e => setApptLoc(e.target.value)} />
                  </div>
                  {apptMsg && <p className={`msg ${apptMsg.startsWith('✓') ? 'msg-success' : 'msg-error'}`}>{apptMsg}</p>}
                  <button type="submit" className="btn-submit" disabled={apptSaving || !apptCode.trim() || !apptTitle.trim() || !apptDate || !apptTime}>
                    {apptSaving ? '⏳ Đang tạo…' : '📅 Tạo lịch khám'}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}