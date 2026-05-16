// src/app/doctor-dashboard/styles.js — CSS cho doctor-dashboard

export const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --sage:      #8fac9a;
  --sage-dk:   #5e8870;
  --sage-xdk:  #3d6652;
  --sage-lt:   #eaf3ee;
  --cream:     #f4f8f5;
  --blush-sage:#ffffff;
  --ink:       #1e2d26;
  --ink-lt:    #4a5e54;
  --muted:     #7a9080;
  --border:    #cde0d5;
  --white:     #ffffff;
  --rose:      #c97070;
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

::-webkit-scrollbar { width: 6px; height: 6px; }
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
  font-size: 1.5rem; font-weight: 600; color: var(--sage-dk);
  display: flex; align-items: center; gap: 0.5rem;
}
.role-badge {
  font-size: 0.85rem; font-weight: 600;
  background: var(--sage-lt); color: var(--sage-xdk);
  padding: 0.4rem 1rem; border-radius: 99px; border: 1px solid var(--border);
}
.btn-logout {
  font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500;
  background: transparent; border: 1px solid var(--border);
  color: var(--muted); padding: 0.4rem 1rem; border-radius: 99px;
  cursor: pointer; transition: all 0.2s;
}
.btn-logout:hover { background: var(--sage-lt); color: var(--ink); border-color: var(--sage-dk); }

/* Layout */
.page { 
  max-width: 1200px; margin: 0 auto; padding: 3rem 5%; 
  display: grid; grid-template-columns: 400px 1fr; gap: 2.5rem; align-items: start; 
}
@media (max-width: 992px) { .page { grid-template-columns: 1fr; } }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: start; }
@media (max-width: 992px) { .grid-2 { grid-template-columns: 1fr; } }
.full-width { grid-column: 1 / -1; }

/* Search Area */
.search-card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 1.5rem 2rem;
  box-shadow: var(--shadow-sm); margin-bottom: 2.5rem;
  display: flex; flex-direction: column; gap: 1rem;
}
.search-label { font-size: 0.85rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.search-row { display: flex; gap: 1rem; }
.search-input {
  flex: 1; padding: 0.85rem 1.2rem; border-radius: var(--radius-md);
  border: 1.5px solid var(--border); background: var(--white);
  font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: var(--ink);
  outline: none; transition: all 0.2s;
}
.search-input::placeholder { color: #a0bfae; }
.search-input:focus { border-color: var(--sage-dk); box-shadow: 0 0 0 3px rgba(94,136,112,0.1); }
.btn-search {
  padding: 0.85rem 2rem; border-radius: 99px; border: none;
  background: var(--sage-dk); color: var(--white);
  font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
  display: flex; align-items: center; gap: 0.5rem;
}
.btn-search:hover:not(:disabled) { background: var(--sage-xdk); transform: translateY(-2px); box-shadow: 0 4px 15px rgba(61,102,82,0.3); }
.btn-search:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

/* Cards */
.card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
  overflow: hidden; margin-bottom: 2.5rem;
}
.card-header {
  padding: 1.5rem 2rem; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  background: var(--white);
}
.card-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 600; color: var(--ink); }
.card-sub { font-size: 0.9rem; color: var(--muted); margin-top: 0.2rem; }

/* Chart & Stats */
.chart-wrap { padding: 2rem 1.5rem 1rem; }
.stat-row { display: flex; gap: 1.5rem; flex-wrap: wrap; padding: 0 2rem 1.5rem; }
.stat-box {
  flex: 1; min-width: 120px; background: var(--white);
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: 1rem 1.2rem; box-shadow: var(--shadow-sm);
}
.stat-label { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
.stat-value { font-size: 1.5rem; font-weight: 600; color: var(--sage-xdk); margin-top: 0.2rem; }
.stat-unit { font-size: 0.85rem; color: var(--muted); font-weight: 500; }

.chart-tooltip {
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 0.8rem 1rem;
  box-shadow: var(--shadow-md); font-size: 0.85rem; color: var(--ink);
}
.chart-tooltip .tt-week { font-weight: 600; color: var(--sage-dk); margin-bottom: 0.25rem; }

/* Table */
.table-wrap { overflow-x: auto; padding: 1rem 0; }
table { width: 100%; border-collapse: collapse; text-align: left; }
thead th {
  padding: 1rem 1.5rem; color: var(--ink); font-weight: 600;
  font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;
  border-bottom: 2px solid var(--border); white-space: nowrap; position: sticky; top: 0;
}
tbody tr { transition: background 0.2s; border-bottom: 1px solid var(--border); }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: var(--sage-lt); }
tbody td { padding: 1rem 1.5rem; color: var(--ink-lt); vertical-align: middle; }
.td-week { font-weight: 600; color: var(--sage-dk); font-size: 1.05rem; }
.tag {
  display: inline-block; background: var(--sage-lt); color: var(--sage-xdk);
  border: 1px solid var(--sage); border-radius: var(--radius-sm);
  padding: 0.3rem 0.6rem; font-size: 0.85rem; font-weight: 500; max-width: 200px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.bp-pill {
  display: inline-block; background: #fff4e6; color: #9a6200;
  border: 1px solid #f0c875; border-radius: 99px;
  padding: 0.2rem 0.8rem; font-size: 0.85rem; font-weight: 600;
}

/* Empty States */
.state-box {
  text-align: center; padding: 4rem 2rem;
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
}
.state-icon {
  width: 64px; height: 64px; border-radius: 50%;
  background: var(--sage-lt); color: var(--sage-dk);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
}
.state-title { font-size: 1.1rem; font-weight: 600; color: var(--ink-lt); }
.state-sub { font-size: 0.95rem; color: var(--muted); max-width: 300px; line-height: 1.5; }
.empty-idle .state-title { color: var(--muted); }
.error-state .state-title { color: #b94040; }
.error-state .state-icon { background: #fdeaea; color: #b94040; }

.empty-state {
  padding: 3rem 2rem; text-align: center; color: var(--muted);
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
}
.empty-state p { font-size: 1rem; max-width: 300px; line-height: 1.5; }
.empty-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--sage-lt); color: var(--sage-dk);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
}

.skeleton-cell {
  height: 16px; border-radius: var(--radius-sm);
  background: linear-gradient(90deg, var(--sage-lt) 25%, var(--border) 50%, var(--sage-lt) 75%);
  background-size: 200% 100%; animation: shimmer 1.5s infinite;
}
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

/* Form fields (Appointments / Patients) */
.form-body { padding: 2rem; }
.form { display: flex; flex-direction: column; gap: 1.5rem; }
.field { display: flex; flex-direction: column; gap: 0.5rem; }
.field label { font-size: 0.85rem; font-weight: 600; color: var(--ink); }
input[type="text"], input[type="date"], input[type="time"], textarea {
  width: 100%; padding: 0.85rem 1.2rem;
  border-radius: var(--radius-md); border: 1.5px solid var(--border);
  background: var(--white); font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: var(--ink);
  outline: none; transition: all 0.2s;
}
input::placeholder, textarea::placeholder { color: #a0bfae; }
input:focus, textarea:focus { border-color: var(--sage-dk); box-shadow: 0 0 0 3px rgba(94,136,112,0.1); }
.btn-submit {
  padding: 1rem; border-radius: 99px; border: none;
  background: var(--sage-dk); color: var(--white); font-family: 'DM Sans', sans-serif;
  font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
}
.btn-submit:hover:not(:disabled) { background: var(--sage-xdk); transform: translateY(-2px); box-shadow: 0 4px 15px rgba(61,102,82,0.3); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
.msg { font-size: 0.9rem; padding: 0.8rem 1rem; border-radius: var(--radius-md); display: flex; align-items: center; gap: 0.5rem; }
.msg-error { color: #b94040; background: #fdeaea; border: 1px solid #f0c0c0; }
.msg-success { color: var(--sage-dk); background: #e8f5ec; border: 1px solid #b8dcc4; }

/* Patient list */
.patient-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.2rem 2rem; border-bottom: 1px solid var(--border); transition: background 0.2s;
}
.patient-item:last-child { border-bottom: none; }
.patient-item:hover { background: var(--sage-lt); }
.patient-code { font-size: 1rem; font-weight: 600; color: var(--sage-xdk); }
.patient-email { font-size: 0.85rem; color: var(--muted); margin-top: 0.2rem; }
.act-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: var(--radius-sm);
  border: 1px solid transparent; cursor: pointer; transition: all 0.2s;
}
.act-del { background: #fdf0f0; color: var(--rose); }
.act-del:hover { background: var(--white); border-color: var(--rose); transform: translateY(-2px); }
`;
