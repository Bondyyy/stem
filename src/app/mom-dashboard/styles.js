// src/app/mom-dashboard/styles.js — CSS cho mom-dashboard

export const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --rose:#e8a0a0;--rose-dk:#c97070;--rose-xdk:#a85555;--blush:#f7ede8;--blush-dk:#f0ddd5;
  --cream:#fdf6f0;--sage:#8fac9a;--sage-dk:#5e8870;--ink:#2d2420;--ink-lt:#5a4540;
  --muted:#8a7570;--border:#ecdbd5;--white:#ffffff;
  --radius-sm:.65rem;--radius-md:1rem;--radius-lg:1.4rem;
  --shadow-sm:0 2px 12px rgba(0,0,0,.07);--shadow-md:0 8px 36px rgba(0,0,0,.10);
  --shadow-lg:0 16px 56px rgba(0,0,0,.16);
}

body { font-family:'DM Sans',sans-serif; background:var(--cream); min-height:100vh; color:var(--ink); }
::-webkit-scrollbar { width:5px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--border); border-radius:99px; }

.nav { background:var(--white); border-bottom:1px solid var(--border); padding:.85rem 2rem; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:10; box-shadow:var(--shadow-sm); }
.nav-brand { font-family:'Playfair Display',serif; font-size:1.3rem; color:var(--rose-dk); display:flex; align-items:center; gap:.45rem; }
.nav-right { display:flex; align-items:center; gap:.85rem; }
.patient-badge { font-size:.78rem; font-weight:500; background:var(--blush); color:var(--rose-xdk); padding:.3rem .8rem; border-radius:99px; border:1px solid var(--rose); letter-spacing:.03em; }
.btn-logout { font-size:.8rem; font-weight:500; background:transparent; border:1px solid var(--border); color:var(--muted); padding:.3rem .85rem; border-radius:99px; cursor:pointer; transition:all .18s; }
.btn-logout:hover { background:var(--blush); color:var(--rose-dk); border-color:var(--rose); }

.page { max-width:1100px; margin:0 auto; padding:2rem 1.5rem; display:grid; grid-template-columns:1fr 380px; gap:1.5rem; align-items:start; }
@media (max-width:780px) { .page { grid-template-columns:1fr; } }

.full-width { grid-column: 1 / -1; }

.card { background:var(--white); border-radius:var(--radius-lg); border:1px solid var(--border); box-shadow:var(--shadow-sm); overflow:hidden; }
.card-header { padding:1.2rem 1.5rem .9rem; border-bottom:1px solid var(--border); background:var(--blush); display:flex; align-items:center; justify-content:space-between; }
.card-title { font-family:'Playfair Display',serif; font-size:1.1rem; color:var(--ink); }
.card-subtitle { font-size:.78rem; color:var(--muted); margin-top:.15rem; }
.week-chip { font-size:.75rem; font-weight:500; background:var(--rose-dk); color:#fff; padding:.25rem .7rem; border-radius:99px; }

.table-wrap { overflow-x:auto; }
table { width:100%; border-collapse:collapse; font-size:.855rem; }
thead th { background:var(--blush-dk); color:var(--muted); font-weight:500; font-size:.75rem; letter-spacing:.06em; text-transform:uppercase; padding:.65rem 1rem; text-align:left; }
tbody tr { border-bottom:1px solid var(--border); transition:background .12s; }
tbody tr:last-child { border-bottom:none; }
tbody tr:hover { background:var(--blush); }
tbody td { padding:.65rem 1rem; color:var(--ink-lt); vertical-align:middle; }
td.week-cell { font-weight:500; color:var(--rose-dk); font-size:1rem; }
.empty-state { padding:3rem 1.5rem; text-align:center; color:var(--muted); font-size:.9rem; }
.empty-icon { font-size:2.5rem; margin-bottom:.6rem; display:block; opacity:.5; }
.symptom-tag { display:inline-block; background:var(--blush); color:var(--rose-xdk); border:1px solid var(--rose); border-radius:6px; padding:.15rem .5rem; font-size:.75rem; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

.act-btn { display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:7px; border:none; cursor:pointer; transition:all .16s; }
.act-edit { background:#f0f8f4; color:var(--sage-dk); }
.act-edit:hover { background:#d8ede3; transform:scale(1.08); }
.act-del { background:#fdf0f0; color:var(--rose-dk); }
.act-del:hover { background:#f8d8d8; transform:scale(1.08); }
.act-del:disabled { opacity:.3; cursor:not-allowed; transform:none; }
.act-done { background:#f0f8f4; color:var(--sage-dk); }
.act-done:hover:not(:disabled) { background:#d8ede3; transform:scale(1.08); }
.act-done:disabled { opacity:.3; cursor:not-allowed; transform:none; }

.form-body { padding:1.4rem 1.5rem; }
.form { display:flex; flex-direction:column; gap:1.05rem; }
.field { display:flex; flex-direction:column; gap:.35rem; }
.field label { font-size:.75rem; font-weight:500; color:var(--muted); letter-spacing:.05em; text-transform:uppercase; }
.input-wrap { position:relative; }
input[type="number"], input[type="text"], input[type="time"], input[type="date"], textarea {
  width:100%; padding:.7rem .95rem; border-radius:var(--radius-sm); border:1.5px solid var(--border);
  background:var(--blush); font-family:'DM Sans',sans-serif; font-size:.93rem; color:var(--ink);
  outline:none; transition:border-color .18s, box-shadow .18s;
}
textarea { resize:vertical; min-height:80px; }
input::placeholder, textarea::placeholder { color:#c5ada7; }
input:focus, textarea:focus { border-color:var(--rose-dk); background:#fff; box-shadow:0 0 0 3px rgba(201,112,112,.14); }
input:disabled { background:var(--blush-dk); color:var(--rose-xdk); font-weight:500; cursor:not-allowed; border-color:var(--rose); }
.lock-icon { position:absolute; right:.75rem; top:50%; transform:translateY(-50%); font-size:.85rem; color:var(--rose); pointer-events:none; }
.hint { font-size:.75rem; color:var(--muted); margin-top:-.2rem; }
.btn-submit { padding:.85rem; border-radius:var(--radius-sm); border:none; background:var(--rose-dk); color:#fff; font-family:'DM Sans',sans-serif; font-size:.95rem; font-weight:500; cursor:pointer; transition:all .18s; display:flex; align-items:center; justify-content:center; gap:.5rem; }
.btn-submit:hover:not(:disabled) { background:var(--rose-xdk); transform:translateY(-1px); box-shadow:0 4px 16px rgba(169,85,85,.25); }
.btn-submit:disabled { opacity:.6; cursor:not-allowed; transform:none; }
.msg { font-size:.83rem; padding:.6rem .9rem; border-radius:.5rem; margin-top:.2rem; }
.msg-error { color:#b94040; background:#fdeaea; border:1px solid #f0c0c0; }
.msg-success { color:var(--sage-dk); background:#e8f5ec; border:1px solid #b8dcc4; }
.skeleton-cell { height:14px; border-radius:6px; background:linear-gradient(90deg,var(--blush) 25%,var(--blush-dk) 50%,var(--blush) 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
@keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }
@keyframes fadeIn { from{opacity:0;background:var(--blush)} to{opacity:1;background:transparent} }
.row-new { animation:fadeIn .6s ease both; }

.modal-overlay { position:fixed; inset:0; z-index:200; background:rgba(45,36,32,.45); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; padding:1rem; animation:fadeOverlay .18s ease both; }
@keyframes fadeOverlay { from{opacity:0} to{opacity:1} }
.modal { background:var(--white); border-radius:var(--radius-lg); border:1px solid var(--border); box-shadow:var(--shadow-lg); width:100%; max-width:440px; animation:slideModal .22s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes slideModal { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
.modal-header { padding:1.1rem 1.4rem .9rem; border-bottom:1px solid var(--border); background:var(--blush); border-radius:var(--radius-lg) var(--radius-lg) 0 0; display:flex; align-items:center; justify-content:space-between; }
.modal-title { font-family:'Playfair Display',serif; font-size:1.1rem; color:var(--ink); }
.modal-week { font-size:.8rem; font-weight:500; background:var(--rose-dk); color:#fff; padding:.22rem .65rem; border-radius:99px; }
.modal-close { background:transparent; border:none; color:var(--muted); cursor:pointer; padding:.25rem; border-radius:6px; transition:all .15s; display:flex; }
.modal-close:hover { background:var(--blush-dk); color:var(--rose-dk); }
.modal-body { padding:1.4rem 1.4rem 1rem; display:flex; flex-direction:column; gap:1rem; }
.modal-footer { padding:.9rem 1.4rem 1.2rem; display:flex; gap:.65rem; }
.btn-save { flex:1; padding:.72rem; border-radius:var(--radius-sm); border:none; background:var(--rose-dk); color:#fff; font-family:'DM Sans',sans-serif; font-size:.9rem; font-weight:500; cursor:pointer; transition:all .18s; display:flex; align-items:center; justify-content:center; gap:.4rem; }
.btn-save:hover:not(:disabled) { background:var(--rose-xdk); }
.btn-save:disabled { opacity:.55; cursor:not-allowed; }
.btn-cancel { flex:1; padding:.72rem; border-radius:var(--radius-sm); border:1.5px solid var(--border); background:transparent; color:var(--muted); font-family:'DM Sans',sans-serif; font-size:.9rem; font-weight:500; cursor:pointer; transition:all .18s; }
.btn-cancel:hover { background:var(--blush); color:var(--ink); border-color:var(--rose); }

.fab { position:fixed; bottom:2rem; right:2rem; z-index:100; width:58px; height:58px; border-radius:50%; border:none; background:linear-gradient(135deg,var(--rose-dk),#e07070); color:#fff; font-size:1.5rem; cursor:pointer; box-shadow:0 6px 24px rgba(201,112,112,.45); display:flex; align-items:center; justify-content:center; transition:all .22s cubic-bezier(.34,1.56,.64,1); }
.fab:hover { transform:scale(1.1); }
.fab.open { background:linear-gradient(135deg,#888,#aaa); }
.fab-label { position:absolute; right:68px; white-space:nowrap; background:var(--ink); color:#fff; font-size:.75rem; font-weight:500; padding:.3rem .7rem; border-radius:6px; pointer-events:none; opacity:0; transform:translateX(6px); transition:all .18s; }
.fab:not(.open):hover .fab-label { opacity:1; transform:translateX(0); }

.chat-window { position:fixed; bottom:6rem; right:2rem; z-index:99; width:360px; max-width:calc(100vw - 2rem); background:var(--white); border-radius:var(--radius-lg); border:1px solid var(--border); box-shadow:var(--shadow-lg); display:flex; flex-direction:column; transform-origin:bottom right; animation:popIn .28s cubic-bezier(.34,1.56,.64,1) both; overflow:hidden; }
@keyframes popIn { from{opacity:0;transform:scale(.85) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
.chat-header { padding:.85rem 1.1rem; background:var(--rose-dk); display:flex; align-items:center; justify-content:space-between; }
.chat-header-left { display:flex; align-items:center; gap:.6rem; }
.chat-avatar { width:34px; height:34px; border-radius:50%; background:rgba(255,255,255,.25); display:flex; align-items:center; justify-content:center; font-size:1.1rem; }
.chat-name { font-size:.92rem; font-weight:500; color:#fff; }
.chat-status { font-size:.72rem; color:rgba(255,255,255,.75); margin-top:1px; }
.chat-close { background:transparent; border:none; color:rgba(255,255,255,.8); font-size:1.1rem; cursor:pointer; padding:.2rem .3rem; border-radius:6px; transition:background .15s; }
.chat-close:hover { background:rgba(255,255,255,.2); color:#fff; }
.chat-messages { flex:1; overflow-y:auto; padding:.9rem 1rem; display:flex; flex-direction:column; gap:.65rem; max-height:340px; min-height:200px; background:var(--cream); }
.chat-messages::-webkit-scrollbar { width:3px; }
.chat-messages::-webkit-scrollbar-thumb { background:var(--border); }
.bubble-wrap { display:flex; flex-direction:column; gap:.2rem; }
.bubble-wrap.user { align-items:flex-end; } .bubble-wrap.ai { align-items:flex-start; }
.bubble { max-width:82%; padding:.6rem .9rem; border-radius:1.1rem; font-size:.875rem; line-height:1.55; word-break:break-word; }
.bubble.user { background:var(--rose-dk); color:#fff; border-bottom-right-radius:.3rem; }
.bubble.ai { background:var(--white); color:var(--ink); border:1px solid var(--border); border-bottom-left-radius:.3rem; }
.bubble-name { font-size:.7rem; color:var(--muted); margin:0 .3rem; }
.typing-bubble { background:var(--white); border:1px solid var(--border); border-radius:1.1rem; border-bottom-left-radius:.3rem; padding:.65rem 1rem; display:flex; align-items:center; gap:4px; }
.typing-dot { width:7px; height:7px; border-radius:50%; background:var(--rose); opacity:.5; animation:typingBounce 1.2s infinite ease-in-out; }
.typing-dot:nth-child(2){animation-delay:.2s} .typing-dot:nth-child(3){animation-delay:.4s}
@keyframes typingBounce { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-5px);opacity:1} }
.chat-input-row { display:flex; gap:.5rem; padding:.75rem .9rem; border-top:1px solid var(--border); background:var(--white); }
.chat-input { flex:1; padding:.55rem .85rem; border-radius:99px; border:1.5px solid var(--border); background:var(--blush); font-family:'DM Sans',sans-serif; font-size:.875rem; color:var(--ink); outline:none; transition:border-color .18s; }
.chat-input::placeholder { color:#c5ada7; }
.chat-input:focus { border-color:var(--rose-dk); background:#fff; }
.chat-send { width:38px; height:38px; border-radius:50%; border:none; background:var(--rose-dk); color:#fff; font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .18s; flex-shrink:0; }
.chat-send:hover:not(:disabled) { background:var(--rose-xdk); transform:scale(1.08); }
.chat-send:disabled { opacity:.45; cursor:not-allowed; transform:none; }
.welcome-hint { text-align:center; padding:.5rem .5rem 0; font-size:.78rem; color:var(--muted); line-height:1.5; }

.todo-item { display:flex; align-items:center; gap:.75rem; padding:.75rem 1.2rem; border-bottom:1px solid var(--border); transition:background .12s; }
.todo-item:last-child { border-bottom:none; }
.todo-item:hover { background:var(--blush); }
.todo-item.done { opacity:.5; }
.todo-item.done .todo-title { text-decoration:line-through; }
.todo-info { flex:1; min-width:0; }
.todo-title { font-size:.9rem; color:var(--ink); font-weight:500; }
.todo-meta { font-size:.75rem; color:var(--muted); margin-top:.15rem; }
.todo-actions { display:flex; gap:5px; flex-shrink:0; }

.appt-item { padding:.9rem 1.3rem; border-bottom:1px solid var(--border); }
.appt-item:last-child { border-bottom:none; }
.appt-title { font-size:.92rem; font-weight:500; color:var(--ink); margin-bottom:.3rem; }
.appt-detail { font-size:.8rem; color:var(--muted); line-height:1.6; }
`;
