'use client';

// src/app/mom-dashboard/page.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, X, Save, AlertCircle, Check } from 'lucide-react';
import { css } from './styles';

const WELCOME = {
  role: 'ai',
  text: 'Xin chào mẹ! 🌸 Mình là người bạn đồng hành của mẹ trong hành trình thai kỳ. Mẹ muốn tâm sự hay hỏi gì mình cũng luôn lắng nghe nhé! 💕',
};

export default function MomDashboard() {
  const router = useRouter();

  const [patientCode, setPatientCode] = useState('');
  const [records,     setRecords]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [newRowId,    setNewRowId]    = useState(null);

  // form
  const [weight,        setWeight]        = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [symptoms,      setSymptoms]      = useState('');
  const [submitting,    setSubmitting]    = useState(false);
  const [formError,     setFormError]     = useState('');
  const [formSuccess,   setFormSuccess]   = useState('');

  // edit modal
  const [editRecord,   setEditRecord]   = useState(null);
  const [editWeight,   setEditWeight]   = useState('');
  const [editBP,       setEditBP]       = useState('');
  const [editSymptoms, setEditSymptoms] = useState('');
  const [editSaving,   setEditSaving]   = useState(false);
  const [editError,    setEditError]    = useState('');

  // delete
  const [deletingId, setDeletingId] = useState(null);

  // chat
  const [chatOpen,  setChatOpen]  = useState(false);
  const [messages,  setMessages]  = useState([WELCOME]);
  const [chatInput, setChatInput] = useState('');
  const [aiTyping,  setAiTyping]  = useState(false);
  const messagesEndRef = useRef(null);

  // ── Todos ──
  const [todos,        setTodos]        = useState([]);
  const [todoTitle,    setTodoTitle]    = useState('');
  const [todoTime,     setTodoTime]     = useState('');
  const [todoDate,     setTodoDate]     = useState('');
  const [todoSaving,   setTodoSaving]   = useState(false);
  const [todoMsg,      setTodoMsg]      = useState('');
  const [editTodo,     setEditTodo]     = useState(null);
  const [etTitle,      setEtTitle]      = useState('');
  const [etTime,       setEtTime]       = useState('');
  const [etDate,       setEtDate]       = useState('');
  const [etSaving,     setEtSaving]     = useState(false);

  // ── Appointments ──
  const [appointments, setAppointments] = useState([]);

  const maxWeek  = records.length > 0 ? Math.max(...records.map(r => r.week)) : 0;
  const nextWeek = maxWeek + 1;

  const fetchRecords = useCallback(async (code) => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/records?patient_code=${code}`);
      const data = await res.json();
      if (res.ok) setRecords(data.records ?? []);
    } catch { /* silent */ }
    finally  { setLoading(false); }
  }, []);

  const fetchTodos = useCallback(async (code) => {
    try {
      const res  = await fetch(`/api/todos?patient_code=${code}`);
      const data = await res.json();
      if (res.ok) setTodos(data.todos ?? []);
    } catch { /* silent */ }
  }, []);

  const fetchAppointments = useCallback(async (code) => {
    try {
      const res  = await fetch(`/api/appointments?patient_code=${code}`);
      const data = await res.json();
      if (res.ok) setAppointments(data.appointments ?? []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    const code = localStorage.getItem('patient_code');
    if (!code) { router.push('/'); return; }
    setPatientCode(code);
    fetchRecords(code);
    fetchTodos(code);
    fetchAppointments(code);
  }, [fetchRecords, fetchTodos, fetchAppointments, router]);


  useEffect(() => {
    if (chatOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiTyping, chatOpen]);

  /* ── submit new record ── */
  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(''); setFormSuccess(''); setSubmitting(true);
    try {
      const res  = await fetch('/api/records', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_code: patientCode, week: nextWeek,
          weight:         weight        ? parseFloat(weight) : null,
          blood_pressure: bloodPressure || null,
          symptoms:       symptoms      || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || 'Đã xảy ra lỗi.'); return; }
      const saved = data.record;
      setRecords(prev => [...prev, saved]);
      setNewRowId(saved.id);
      setTimeout(() => setNewRowId(null), 1200);
      setFormSuccess(`✓ Đã lưu Tuần ${saved.week} thành công!`);
      setWeight(''); setBloodPressure(''); setSymptoms('');
      setTimeout(() => setFormSuccess(''), 3500);
    } catch { setFormError('Không thể kết nối máy chủ.'); }
    finally  { setSubmitting(false); }
  }

  /* ── open edit modal ── */
  function openEdit(record) {
    setEditRecord(record);
    setEditWeight(record.weight ?? '');
    setEditBP(record.blood_pressure ?? '');
    setEditSymptoms(record.symptoms ?? '');
    setEditError('');
  }

  /* ── save edit ── */
  async function handleEditSave() {
    setEditSaving(true); setEditError('');
    try {
      const res  = await fetch('/api/records', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id:             editRecord.id,
          weight:         editWeight  ? parseFloat(editWeight) : null,
          blood_pressure: editBP      || null,
          symptoms:       editSymptoms || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setEditError(data.error || 'Lỗi khi cập nhật.'); return; }
      // update in-place
      setRecords(prev => prev.map(r => r.id === data.record.id ? data.record : r));
      setEditRecord(null);
    } catch { setEditError('Không thể kết nối máy chủ.'); }
    finally  { setEditSaving(false); }
  }

  /* ── delete record ── */
  async function handleDelete(record) {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa dữ liệu Tuần ${record.week}?`);
    if (!confirmed) return;
    setDeletingId(record.id);
    try {
      const res  = await fetch('/api/records', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record.id, patient_code: patientCode, week: record.week }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || 'Không thể xóa.'); return; }
      setRecords(prev => prev.filter(r => r.id !== record.id));
    } catch { alert('Không thể kết nối máy chủ.'); }
    finally  { setDeletingId(null); }
  }

  /* ── chat ── */
  async function handleChatSend(e) {
    e?.preventDefault();
    const text = chatInput.trim();
    if (!text || aiTyping) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setChatInput('');
    setAiTyping(true);
    try {
      const res  = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, records }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || data.error || 'Mình chưa hiểu, mẹ nói lại nhé! 😊' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Kết nối tạm thời gián đoạn, mẹ thử lại nhé! 🙏' }]);
    } finally { setAiTyping(false); }
  }

  function handleLogout() {
    localStorage.removeItem('patient_code');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    router.push('/');
  }

  /* ── todo handlers ── */
  async function handleAddTodo(e) {
    e.preventDefault();
    if (!todoTitle.trim()) return;
    setTodoSaving(true); setTodoMsg('');
    try {
      const res = await fetch('/api/todos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_code: patientCode, title: todoTitle, task_time: todoTime || null, task_date: todoDate || null }),
      });
      const data = await res.json();
      if (!res.ok) { setTodoMsg(data.error || 'Lỗi.'); return; }
      setTodos(prev => [...prev, data.todo]);
      setTodoTitle(''); setTodoTime(''); setTodoDate('');
      setTodoMsg('✓ Đã thêm việc cần làm!');
      setTimeout(() => setTodoMsg(''), 3000);
    } catch { setTodoMsg('Không thể kết nối máy chủ.'); }
    finally { setTodoSaving(false); }
  }

  async function handleToggleTodo(todo) {
    if (todo.completed) return;
    try {
      const res = await fetch('/api/todos', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: todo.id, completed: 1 }),
      });
      const data = await res.json();
      if (res.ok) {
        setTodos(prev => prev.map(t => t.id === todo.id ? data.todo : t));
        alert('Chúc mừng bạn đã hoàn thành công việc!');
      }
    } catch { /* silent */ }
  }

  async function handleDeleteTodo(todo) {
    if (!window.confirm('Bạn có chắc chắn muốn xóa việc này không?')) return;
    try {
      const res = await fetch('/api/todos', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: todo.id }),
      });
      if (res.ok) setTodos(prev => prev.filter(t => t.id !== todo.id));
    } catch { /* silent */ }
  }

  function openEditTodo(todo) {
    setEditTodo(todo);
    setEtTitle(todo.title); setEtTime(todo.task_time || ''); setEtDate(todo.task_date || '');
  }

  async function handleSaveEditTodo() {
    if (!etTitle.trim()) return;
    setEtSaving(true);
    try {
      const res = await fetch('/api/todos', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editTodo.id, title: etTitle, task_time: etTime || null, task_date: etDate || null }),
      });
      const data = await res.json();
      if (res.ok) {
        setTodos(prev => prev.map(t => t.id === editTodo.id ? data.todo : t));
        setEditTodo(null);
      }
    } catch { /* silent */ }
    finally { setEtSaving(false); }
  }

  const skeletonRows = Array.from({ length: 4 });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Nav ── */}
      <nav className="nav">
        <div className="nav-brand"><span>🌸</span> MamaTrack</div>
        <div className="nav-right">
          {patientCode && <span className="patient-badge">Mã: {patientCode}</span>}
          <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </nav>

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
            {!loading && records.length > 0 && <span className="week-chip">Tuần {maxWeek}</span>}
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tuần</th>
                  <th>Cân nặng</th>
                  <th>Huyết áp</th>
                  <th>Ghi chú</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  skeletonRows.map((_, i) => (
                    <tr key={i}>
                      {[40, 70, 60, 110, 60].map((w, j) => (
                        <td key={j}><div className="skeleton-cell" style={{ width: w }} /></td>
                      ))}
                    </tr>
                  ))
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <span className="empty-icon">📋</span>
                        Chưa có dữ liệu. Hãy nhập tuần đầu tiên!
                      </div>
                    </td>
                  </tr>
                ) : (
                  records.map(r => {
                    const isLatest  = r.week === maxWeek;
                    const isDeleting = deletingId === r.id;
                    return (
                      <tr key={r.id} className={r.id === newRowId ? 'row-new' : ''}>
                        <td className="week-cell">{r.week}</td>
                        <td>{r.weight ?? <span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>—</span>}</td>
                        <td>{r.blood_pressure ?? <span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>—</span>}</td>
                        <td>
                          {r.symptoms
                            ? <span className="symptom-tag" title={r.symptoms}>{r.symptoms}</span>
                            : <span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>—</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            {/* Edit — always available */}
                            <button
                              className="act-btn act-edit"
                              title="Sửa tuần này"
                              onClick={() => openEdit(r)}
                            >
                              <Pencil size={14} />
                            </button>

                            {/* Delete — only enabled on latest week */}
                            <button
                              className="act-btn act-del"
                              title={isLatest ? 'Xóa tuần này' : 'Chỉ được xóa tuần gần nhất'}
                              disabled={!isLatest || isDeleting}
                              onClick={() => handleDelete(r)}
                              style={{ opacity: isLatest ? 1 : 0.25 }}
                            >
                              {isDeleting
                                ? <span style={{ fontSize: '12px' }}>…</span>
                                : <Trash2 size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
              <div className="card-subtitle">{loading ? '…' : `Tiếp theo: Tuần ${nextWeek}`}</div>
            </div>
            <span style={{ fontSize: '1.5rem' }}>🩺</span>
          </div>
          <div className="form-body">
            <form className="form" onSubmit={handleSubmit}>
              <div className="field">
                <label>Tuần thai</label>
                <div className="input-wrap">
                  <input type="number" value={loading ? '' : nextWeek} disabled readOnly placeholder="Đang tải…" />
                  <span className="lock-icon">🔒</span>
                </div>
                <span className="hint">Tự động tính từ lần nhập trước</span>
              </div>
              <div className="field">
                <label>Cân nặng (kg)</label>
                <input type="number" step="0.1" min="30" max="200" placeholder="VD: 56.5"
                  value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
              <div className="field">
                <label>Huyết áp</label>
                <input type="text" placeholder="VD: 110/70"
                  value={bloodPressure} onChange={e => setBloodPressure(e.target.value)} />
              </div>
              <div className="field">
                <label>Ghi chú</label>
                <textarea placeholder="VD: Buồn nôn nhẹ, mệt mỏi…"
                  value={symptoms} onChange={e => setSymptoms(e.target.value)} />
              </div>
              {formError   && <p className="msg msg-error">{formError}</p>}
              {formSuccess && <p className="msg msg-success">{formSuccess}</p>}
              <button type="submit" className="btn-submit" disabled={submitting || loading}>
                {submitting ? '⏳ Đang lưu…' : `💾 Lưu tuần ${loading ? '…' : nextWeek}`}
              </button>
            </form>
          </div>
        </div>

        {/* ── Việc cần làm ── */}
        <div className="card full-width">
          <div className="card-header">
            <div>
              <div className="card-title">Việc cần làm</div>
              <div className="card-subtitle">{todos.filter(t => !t.completed).length} việc chưa hoàn thành</div>
            </div>
            <span style={{ fontSize: '1.3rem' }}>📝</span>
          </div>
          <div className="form-body">
            <form className="form" onSubmit={handleAddTodo} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '.6rem' }}>
              <div className="field" style={{ flex: '2 1 180px' }}>
                <label>Tên việc</label>
                <input type="text" placeholder="VD: Uống vitamin" value={todoTitle} onChange={e => setTodoTitle(e.target.value)} />
              </div>
              <div className="field" style={{ flex: '1 1 100px' }}>
                <label>Thời gian</label>
                <input type="time" value={todoTime} onChange={e => setTodoTime(e.target.value)} />
              </div>
              <div className="field" style={{ flex: '1 1 130px' }}>
                <label>Ngày thực hiện</label>
                <input type="date" value={todoDate} onChange={e => setTodoDate(e.target.value)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', flex: '0 0 auto' }}>
                <button type="submit" className="btn-submit" disabled={todoSaving || !todoTitle.trim()} style={{ padding: '.7rem 1.2rem' }}>
                  {todoSaving ? '⏳' : '➕ Thêm'}
                </button>
              </div>
            </form>
            {todoMsg && <p className={`msg ${todoMsg.startsWith('✓') ? 'msg-success' : 'msg-error'}`} style={{ marginTop: '.5rem' }}>{todoMsg}</p>}
          </div>

          {todos.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">🎯</span>Chưa có việc cần làm nào.</div>
          ) : (
            todos.map(t => (
              <div key={t.id} className={`todo-item${t.completed ? ' done' : ''}`}>
                <div className="todo-info">
                  <div className="todo-title">{t.title}</div>
                  <div className="todo-meta">
                    {t.task_time && <span>🕐 {t.task_time}</span>}
                    {t.task_date && <span> 📅 {t.task_date}</span>}
                  </div>
                </div>
                <div className="todo-actions">
                  {!t.completed && (
                    <>
                      <button className="act-btn act-done" title="Đã làm xong" onClick={() => handleToggleTodo(t)}><Check size={14} /></button>
                      <button className="act-btn act-edit" title="Sửa" onClick={() => openEditTodo(t)}><Pencil size={14} /></button>
                    </>
                  )}
                  <button className="act-btn act-del" title="Xóa" onClick={() => handleDeleteTodo(t)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Lịch khám sắp tới ── */}
        <div className="card full-width">
          <div className="card-header">
            <div>
              <div className="card-title">Lịch khám sắp tới</div>
              <div className="card-subtitle">{appointments.length} lịch hẹn</div>
            </div>
            <span style={{ fontSize: '1.3rem' }}>🗓️</span>
          </div>
          {appointments.length === 0 ? (
            <div className="empty-state"><span className="empty-icon">📅</span>Chưa có lịch khám nào.</div>
          ) : (
            appointments.map(a => (
              <div key={a.id} className="appt-item">
                <div className="appt-title">🏥 {a.title}</div>
                <div className="appt-detail">
                  📅 {a.appointment_date} &nbsp;·&nbsp; 🕐 {a.appointment_time}
                  {a.location && <><br />📍 {a.location}</>}
                </div>
              </div>
            ))
          )}
        </div>

      </main>

      {/* ── Edit Modal ── */}
      {editRecord && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditRecord(null); }}>
          <div className="modal">
            <div className="modal-header">
              <div>
                <div className="modal-title">Chỉnh sửa dữ liệu</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <span className="modal-week">Tuần {editRecord.week}</span>
                <button className="modal-close" onClick={() => setEditRecord(null)}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '-.3rem' }}>
                Tuần thai không thể thay đổi. Chỉnh sửa các chỉ số bên dưới.
              </p>

              <div className="field">
                <label>Cân nặng (kg)</label>
                <input type="number" step="0.1" min="30" max="200" placeholder="VD: 56.5"
                  value={editWeight} onChange={e => setEditWeight(e.target.value)} />
              </div>
              <div className="field">
                <label>Huyết áp</label>
                <input type="text" placeholder="VD: 110/70"
                  value={editBP} onChange={e => setEditBP(e.target.value)} />
              </div>
              <div className="field">
                <label>Ghi chú</label>
                <textarea placeholder="VD: Buồn nôn nhẹ…"
                  value={editSymptoms} onChange={e => setEditSymptoms(e.target.value)} />
              </div>

              {editError && (
                <div className="msg msg-error" style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                  <AlertCircle size={14} /> {editError}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setEditRecord(null)}>
                Hủy
              </button>
              <button className="btn-save" onClick={handleEditSave} disabled={editSaving}>
                {editSaving ? '⏳ Đang lưu…' : <><Save size={14} /> Lưu thay đổi</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Todo Edit Modal ── */}
      {editTodo && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditTodo(null); }}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Sửa việc cần làm</div>
              <button className="modal-close" onClick={() => setEditTodo(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>Tên việc</label>
                <input type="text" value={etTitle} onChange={e => setEtTitle(e.target.value)} />
              </div>
              <div className="field">
                <label>Thời gian</label>
                <input type="time" value={etTime} onChange={e => setEtTime(e.target.value)} />
              </div>
              <div className="field">
                <label>Ngày</label>
                <input type="date" value={etDate} onChange={e => setEtDate(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setEditTodo(null)}>Hủy</button>
              <button className="btn-save" onClick={handleSaveEditTodo} disabled={etSaving || !etTitle.trim()}>
                {etSaving ? '⏳ Đang lưu…' : <><Save size={14} /> Lưu</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FAB ── */}
      <button className={`fab${chatOpen ? ' open' : ''}`} onClick={() => setChatOpen(o => !o)}>
        <span className="fab-label">Tâm sự với AI</span>
        {chatOpen ? '✕' : '💬'}
      </button>

      {/* ── Chat Window ── */}
      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar">🤖</div>
              <div>
                <div className="chat-name">Trợ lý MamaAI</div>
                <div className="chat-status">{aiTyping ? 'Đang gõ…' : 'Luôn bên cạnh mẹ 💕'}</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => setChatOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.length === 1 && (
              <p className="welcome-hint">
                AI đã đọc lịch sử {records.length} tuần thai kỳ của mẹ và sẵn sàng lắng nghe 🌸
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`bubble-wrap ${msg.role}`}>
                <span className="bubble-name">{msg.role === 'user' ? 'Mẹ' : 'AI'}</span>
                <div className={`bubble ${msg.role}`}>{msg.text}</div>
              </div>
            ))}
            {aiTyping && (
              <div className="bubble-wrap ai">
                <span className="bubble-name">AI</span>
                <div className="typing-bubble">
                  <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-row" onSubmit={handleChatSend}>
            <input className="chat-input" type="text" placeholder="Nhắn gì đó với AI…"
              value={chatInput} onChange={e => setChatInput(e.target.value)} disabled={aiTyping} />
            <button className="chat-send" type="submit" disabled={!chatInput.trim() || aiTyping}>➤</button>
          </form>
        </div>
      )}
    </>
  );
}