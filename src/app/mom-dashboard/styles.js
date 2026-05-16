// src/app/mom-dashboard/styles.js — CSS cho mom-dashboard

export const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --rose:    #e8a0a0;
  --rose-dk: #c97070;
  --blush:   #fcf5f2;
  --cream:   #fdf8f5;
  --sage:    #8fac9a;
  --sage-dk: #5e8870;
  --ink:     #2d2420;
  --muted:   #8a7570;
  --white:   #ffffff;
  --border:  #efe4df;
  --radius-lg: 24px;
  --radius-md: 16px;
  --radius-sm: 12px;
  --shadow-sm: 0 4px 20px rgba(0,0,0,0.04);
  --shadow-md: 0 12px 40px rgba(0,0,0,0.08);
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  color: var(--ink);
  min-height: 100vh;
  line-height: 1.6;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

/* Navbar */
.nav {
  background: var(--white);
  border-bottom: 1px solid var(--border);
  padding: 1rem 5%;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 10;
}
.nav-brand {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem; font-weight: 600; color: var(--rose-dk);
}
.nav-right { display: flex; align-items: center; gap: 1rem; }
.patient-badge {
  font-size: 0.85rem; font-weight: 600;
  background: var(--blush); color: var(--rose-dk);
  padding: 0.4rem 1rem; border-radius: 99px;
  border: 1px solid var(--border);
}
.btn-logout {
  font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500;
  background: transparent; border: 1px solid var(--border);
  color: var(--muted); padding: 0.4rem 1rem; border-radius: 99px;
  cursor: pointer; transition: all 0.2s;
}
.btn-logout:hover {
  background: var(--blush); color: var(--ink); border-color: var(--rose-dk);
}

/* Layout */
.page {
  max-width: 1200px; margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex; flex-direction: column;
  gap: 1.5rem;
}

.full-width { width: 100%; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
@media (max-width: 992px) { .grid-2 { grid-template-columns: 1fr; } }

/* Cards */
.card {
  background: var(--white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: 2.5rem;
}
.card-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  background: var(--white);
}
.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem; font-weight: 600; color: var(--ink);
}
.card-subtitle {
  font-size: 0.9rem; color: var(--muted); margin-top: 0.2rem;
}
.week-chip {
  font-size: 0.85rem; font-weight: 600;
  background: var(--rose-dk); color: var(--white);
  padding: 0.4rem 1rem; border-radius: 99px;
}

/* Stats */
.stat-row { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1.5rem; padding: 0 2rem 1.5rem; }
@media (max-width: 992px) { .stat-row { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); } }
.stat-box {
  min-width: 0; background: var(--blush);
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: 1rem 1.2rem; box-shadow: var(--shadow-sm);
}
.stat-label { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; white-space: normal; line-height: 1.3; }
.stat-value { font-size: 1.5rem; font-weight: 600; color: var(--rose-dk); margin-top: 0.2rem; }
.stat-unit { font-size: 0.85rem; color: var(--muted); font-weight: 500; }

/* Forms */
.form-body { padding: 2rem; }
.form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field label {
  font-size: 0.85rem; font-weight: 600; color: var(--ink);
}
.input-wrap { position: relative; }
input[type="number"], input[type="text"], input[type="time"], input[type="date"], select, textarea {
  width: 100%; padding: 0.85rem 1.2rem;
  border-radius: var(--radius-md); border: 1.5px solid var(--border);
  background: var(--white);
  font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: var(--ink);
  outline: none; transition: all 0.2s;
}
select { padding-right: 2.8rem; white-space: nowrap; font-size: 0.95rem; }
textarea { resize: vertical; min-height: 100px; }
input::placeholder, textarea::placeholder { color: #c5ada7; }
input:focus, select:focus, textarea:focus {
  border-color: var(--rose-dk); box-shadow: 0 0 0 3px rgba(201,112,112,0.1);
}
input:disabled {
  background: var(--blush); color: var(--muted); cursor: not-allowed;
}
.lock-icon {
  position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
  font-size: 0.9rem; color: var(--muted); pointer-events: none;
}
.hint { font-size: 0.85rem; color: var(--muted); margin-top: -0.2rem; }

/* Buttons */
.btn-submit {
  padding: 1rem; border-radius: 99px; border: none;
  background: var(--rose-dk); color: var(--white);
  font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
}
.btn-submit:hover:not(:disabled) {
  background: #b85c5c; transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(201,112,112,0.3);
}
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

.act-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: var(--radius-sm);
  border: 1px solid transparent; cursor: pointer; transition: all 0.2s;
}
.act-edit { background: var(--sage-lt); color: var(--sage-dk); }
.act-edit:hover { background: var(--white); border-color: var(--sage-dk); transform: translateY(-2px); }
.act-del { background: #fdf0f0; color: var(--rose-dk); }
.act-del:hover:not(:disabled) { background: var(--white); border-color: var(--rose-dk); transform: translateY(-2px); }
.act-del:disabled { opacity: 0.4; cursor: not-allowed; }
.act-done { background: var(--sage-lt); color: var(--sage-dk); }
.act-done:hover:not(:disabled) { background: var(--white); border-color: var(--sage-dk); transform: translateY(-2px); }
.act-done:disabled { opacity: 0.4; cursor: not-allowed; }

/* Messages */
.msg {
  font-size: 0.9rem; padding: 0.8rem 1rem; border-radius: var(--radius-md);
  display: flex; align-items: center; gap: 0.5rem;
}
.msg-error { color: #b94040; background: #fdeaea; border: 1px solid #f0c0c0; }
.msg-success { color: var(--sage-dk); background: #e8f5ec; border: 1px solid #b8dcc4; }

/* Table */
.table-wrap { overflow-x: auto; padding: 1rem 0; }
table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; table-layout: auto; min-width: 800px; }
thead th {
  padding: 0.75rem; color: var(--ink); font-weight: 600;
  font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;
  border-bottom: 2px solid var(--border); white-space: nowrap;
}
tbody tr { transition: background 0.2s; border-bottom: 1px solid var(--border); }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: var(--blush); }
tbody td { padding: 0.75rem; color: var(--ink); vertical-align: middle; white-space: normal; line-height: 1.4; word-break: break-word; }
td.week-cell { font-weight: 600; color: var(--rose-dk); font-size: 1rem; }

.symptom-tag {
  display: inline-block; background: var(--blush); color: var(--ink);
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: 0.3rem 0.6rem; font-size: 0.85rem; font-weight: 500;
}
.badge-tag {
  display: inline-flex; align-items: center; max-width: 100%;
  background: #fff5f7; color: var(--rose-dk);
  border: 1px solid #fbdce2; border-radius: 999px;
  padding: 0.35rem 0.65rem; font-size: 0.85rem; font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.text-clamp {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

/* Empty States */
.empty-state {
  padding: 4rem 2rem; text-align: center; color: var(--muted);
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
}
.empty-state p { font-size: 1rem; max-width: 300px; line-height: 1.5; }
.empty-icon {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--blush); color: var(--rose-dk);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
}

/* Modals */
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(45,36,32,0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 1rem;
  animation: fadeIn 0.2s ease;
}
.modal {
  background: var(--white); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md); width: 100%; max-width: 500px;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.modal-header {
  padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.modal-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 600; }
.modal-close {
  background: transparent; border: none; color: var(--muted);
  cursor: pointer; padding: 0.5rem; border-radius: 50%; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.modal-close:hover { background: var(--blush); color: var(--ink); }
.modal-body { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
.modal-footer { padding: 1.5rem 2rem; border-top: 1px solid var(--border); display: flex; gap: 1rem; }
.btn-save {
  flex: 1; padding: 1rem; border-radius: 99px; border: none;
  background: var(--rose-dk); color: var(--white); font-weight: 600; font-size: 1rem;
  cursor: pointer; transition: all 0.2s;
}
.btn-save:hover:not(:disabled) { background: #b85c5c; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-cancel {
  flex: 1; padding: 1rem; border-radius: 99px; border: 1.5px solid var(--border);
  background: var(--white); color: var(--ink); font-weight: 600; font-size: 1rem;
  cursor: pointer; transition: all 0.2s;
}
.btn-cancel:hover { background: var(--blush); border-color: var(--rose-dk); }

/* List Items (Todos & Appointments) */
.list-item {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);
  transition: background 0.2s;
}
.list-item:last-child { border-bottom: none; }
.list-item:hover { background: var(--blush); }
.list-item.done { opacity: 0.5; }
.list-item.done .list-title { text-decoration: line-through; color: var(--muted); }
.list-info { flex: 1; min-width: 0; }
.list-title { font-size: 1.1rem; font-weight: 600; color: var(--ink); margin-bottom: 0.3rem; }
.list-meta { font-size: 0.95rem; color: var(--muted); line-height: 1.5; }
.list-actions { display: flex; gap: 0.5rem; }

/* Skeleton */
.skeleton-cell {
  height: 16px; border-radius: var(--radius-sm);
  background: linear-gradient(90deg, var(--blush) 25%, var(--border) 50%, var(--blush) 75%);
  background-size: 200% 100%; animation: shimmer 1.5s infinite;
}
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
.row-new { animation: highlight 1s ease; }
@keyframes highlight { 0% { background: var(--blush); } 100% { background: transparent; } }

/* Chat Components */
.fab {
  position: fixed; bottom: 2rem; right: 2rem; z-index: 100;
  width: auto; min-width: 150px; height: 50px; border-radius: 999px; padding: 0 18px; border: none;
  background: var(--rose-dk); color: var(--white); font-size: 1rem; white-space: nowrap; font-weight: 600;
  cursor: pointer; box-shadow: var(--shadow-md); display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.fab:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(201,112,112,0.3); }
.fab.open { background: var(--ink); }

.chat-window {
  position: fixed; bottom: 6rem; right: 2rem; z-index: 99;
  width: 380px; max-width: calc(100vw - 2rem);
  background: var(--white); border-radius: var(--radius-lg);
  border: 1px solid var(--border); box-shadow: var(--shadow-md);
  display: flex; flex-direction: column; overflow: hidden;
  transform-origin: bottom right; animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes scaleIn { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }

.chat-header {
  padding: 1.2rem 1.5rem; background: var(--white);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.chat-header-left { display: flex; align-items: center; gap: 0.8rem; }
.chat-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--blush); color: var(--rose-dk);
  display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
}
.chat-name { font-size: 1rem; font-weight: 600; color: var(--ink); }
.chat-status { font-size: 0.8rem; color: var(--sage-dk); font-weight: 500; }
.chat-close {
  background: transparent; border: none; color: var(--muted);
  cursor: pointer; padding: 0.5rem; border-radius: 50%; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.chat-close:hover { background: var(--blush); color: var(--ink); }

.chat-messages {
  flex: 1; overflow-y: auto; padding: 1.5rem;
  display: flex; flex-direction: column; gap: 1rem;
  height: 400px; background: var(--cream);
}
.bubble-wrap { display: flex; flex-direction: column; gap: 0.2rem; }
.bubble-wrap.user { align-items: flex-end; }
.bubble-wrap.ai { align-items: flex-start; }
.bubble {
  max-width: 85%; padding: 0.8rem 1rem; border-radius: var(--radius-md);
  font-size: 0.95rem; line-height: 1.5; word-break: break-word;
}
.bubble.user {
  background: var(--rose-dk); color: var(--white);
  border-bottom-right-radius: 4px;
}
.bubble.ai {
  background: var(--white); color: var(--ink);
  border: 1px solid var(--border); border-bottom-left-radius: 4px;
  box-shadow: var(--shadow-sm);
}

.chat-input-row {
  display: flex; gap: 0.8rem; padding: 1rem 1.5rem;
  border-top: 1px solid var(--border); background: var(--white);
}
.chat-input {
  flex: 1; padding: 0.8rem 1.2rem; border-radius: 99px;
  border: 1.5px solid var(--border); background: var(--white);
  font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: var(--ink);
  outline: none; transition: border-color 0.2s;
}
.chat-input:focus { border-color: var(--rose-dk); }
.chat-send {
  width: 44px; height: 44px; border-radius: 50%; border: none;
  background: var(--rose-dk); color: var(--white);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; flex-shrink: 0;
}
.chat-send:hover:not(:disabled) { background: #b85c5c; transform: translateY(-2px); }
.chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
`;
