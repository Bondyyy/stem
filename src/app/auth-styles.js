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
  --sage-lt: #f0f5f2;
  --ink:     #2d2420;
  --muted:   #8a7570;
  --white:   #ffffff;
  --border:  #efe4df;
  --radius-lg: 24px;
  --radius-md: 16px;
  --shadow-sm: 0 4px 20px rgba(0,0,0,0.04);
  --shadow-md: 0 12px 40px rgba(0,0,0,0.08);
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  color: var(--ink);
  min-height: 100vh;
  line-height: 1.6;
  overflow-x: hidden;
}

/* Background Gradients */
.bg-blobs {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}
.blob-1 {
  position: absolute; width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(232, 160, 160, 0.2) 0%, transparent 70%);
  top: -150px; left: -150px; border-radius: 50%;
  animation: floatBlob1 15s ease-in-out infinite alternate;
}
.blob-2 {
  position: absolute; width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(143, 172, 154, 0.2) 0%, transparent 70%);
  bottom: -100px; right: -100px; border-radius: 50%;
  animation: floatBlob2 18s ease-in-out infinite alternate;
}
@keyframes floatBlob1 {
  0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
  100% { transform: translate(40px, 30px) scale(1.05); opacity: 1; }
}
@keyframes floatBlob2 {
  0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
  100% { transform: translate(-30px, -40px) scale(1.1); opacity: 1; }
}

/* Navbar */
.navbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.5rem 5%;
  position: absolute; top: 0; left: 0; width: 100%;
  z-index: 10;
}
.nav-brand {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem; font-weight: 600; color: var(--rose-dk);
  display: flex; align-items: center; gap: 0.5rem;
}

/* Section Common */
.section {
  padding: 6rem 5%;
  max-width: 1200px;
  margin: 0 auto;
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem; font-weight: 600; color: var(--ink);
  text-align: center; margin-bottom: 1rem;
}
.section-subtitle {
  text-align: center; color: var(--muted); max-width: 600px; margin: 0 auto 4rem;
  font-size: 1.1rem;
}

/* Hero Section */
.hero {
  padding-top: 10rem;
  text-align: center;
  min-height: 90vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.hero h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 600; color: var(--ink);
  line-height: 1.1; margin-bottom: 1.5rem;
  max-width: 800px;
}
.hero p {
  font-size: 1.15rem; color: var(--muted);
  max-width: 650px; margin-bottom: 3rem;
}
.hero-btns {
  display: flex; gap: 1rem; justify-content: center;
}
.btn-primary {
  background: var(--rose-dk); color: var(--white);
  padding: 1rem 2rem; border-radius: 99px;
  font-size: 1.05rem; font-weight: 500; border: none;
  cursor: pointer; transition: all 0.2s ease;
  text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;
}
.btn-primary:hover {
  background: #b85c5c; transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(201, 112, 112, 0.25);
}
.btn-secondary {
  background: var(--white); color: var(--sage-dk);
  padding: 1rem 2rem; border-radius: 99px;
  font-size: 1.05rem; font-weight: 500; border: 1.5px solid var(--sage-dk);
  cursor: pointer; transition: all 0.2s ease;
  text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;
}
.btn-secondary:hover {
  background: var(--sage-lt); transform: translateY(-2px);
}

/* Feature Grid */
.feature-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}
.feature-card {
  background: var(--white);
  padding: 2.5rem 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border);
  animation: fadeUp 0.5s ease-out backwards;
}
.feature-card:hover {
  transform: translateY(-4px); box-shadow: var(--shadow-md);
}
.feature-icon {
  font-size: 2.5rem; margin-bottom: 1.2rem;
  display: inline-block;
  padding: 1rem; border-radius: 50%;
}
.mom-card .feature-icon { background: var(--blush); color: var(--rose-dk); }
.doc-card .feature-icon { background: var(--sage-lt); color: var(--sage-dk); }

.feature-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 0.8rem; color: var(--ink); }
.feature-desc { color: var(--muted); font-size: 0.95rem; }

/* Process Section */
.process-steps {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem; position: relative;
}
.process-step {
  text-align: center; position: relative;
}
.step-number {
  width: 50px; height: 50px;
  background: var(--rose-dk); color: var(--white);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 600;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 15px rgba(201, 112, 112, 0.3);
}
.step-title { font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem; }
.step-desc { color: var(--muted); font-size: 0.9rem; }

/* Auth Section */
.auth-wrapper {
  display: flex; justify-content: center;
  padding: 4rem 5%; padding-bottom: 8rem;
}
.auth-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%; max-width: 480px;
  padding: 3rem 2.5rem;
  border: 1px solid var(--border);
  animation: fadeUp 0.45s ease-out backwards;
}
.auth-header { text-align: center; margin-bottom: 2.5rem; }
.auth-header h2 { font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 0.5rem; }
.auth-header p { color: var(--muted); font-size: 0.95rem; }

.roles { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
.role-btn {
  display: flex; flex-direction: column; align-items: center;
  gap: 0.5rem; padding: 1.2rem 0.5rem;
  border-radius: var(--radius-md); border: 2px solid var(--border);
  background: var(--white); cursor: pointer; transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
}
.role-btn:hover { transform: translateY(-2px); }
.role-btn.active-mom { border-color: var(--rose-dk); background: var(--blush); }
.role-btn.active-doc { border-color: var(--sage-dk); background: var(--sage-lt); }
.role-btn .icon { font-size: 2rem; }
.role-btn .label { font-size: 0.9rem; font-weight: 500; color: var(--ink); }

.tabs {
  display: flex; background: var(--blush); border-radius: 99px;
  padding: 0.3rem; margin-bottom: 2rem;
}
.tab-btn {
  flex: 1; padding: 0.6rem;
  border: none; background: transparent; border-radius: 99px;
  font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
  color: var(--muted); cursor: pointer; transition: all 0.2s;
}
.tab-btn.active-mom { background: var(--rose-dk); color: var(--white); box-shadow: var(--shadow-sm); }
.tab-btn.active-doc { background: var(--sage-dk); color: var(--white); box-shadow: var(--shadow-sm); }

.form { display: flex; flex-direction: column; gap: 1.2rem; }
.field-group { display: flex; flex-direction: column; gap: 0.5rem; }
.field-group label {
  font-size: 0.85rem; font-weight: 600; color: var(--ink);
}
.form input {
  padding: 0.85rem 1.2rem;
  border-radius: var(--radius-md); border: 1.5px solid var(--border);
  background: var(--white);
  font-family: 'DM Sans', sans-serif; font-size: 0.95rem; color: var(--ink);
  outline: none; transition: all 0.2s;
}
.form input:focus { border-color: var(--rose-dk); box-shadow: 0 0 0 3px rgba(201,112,112,0.1); }
.form.doc input:focus { border-color: var(--sage-dk); box-shadow: 0 0 0 3px rgba(94,136,112,0.1); }

.otp-row { display: flex; gap: 0.8rem; align-items: stretch; }
.otp-row input { flex: 1; font-weight: 500; letter-spacing: 0.1rem; }
.btn-otp {
  padding: 0 1.2rem; border-radius: var(--radius-md); border: 1.5px solid var(--rose-dk);
  background: transparent; color: var(--rose-dk);
  font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.btn-otp:hover:not(:disabled) { background: var(--rose-dk); color: var(--white); }
.btn-otp.doc { border-color: var(--sage-dk); color: var(--sage-dk); }
.btn-otp.doc:hover:not(:disabled) { background: var(--sage-dk); color: var(--white); }
.btn-otp:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-submit {
  margin-top: 1rem; padding: 1rem;
  border-radius: 99px; border: none;
  font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; color: var(--white);
}
.btn-submit.mom { background: var(--rose-dk); }
.btn-submit.mom:hover:not(:disabled) { background: #b85c5c; transform: translateY(-1px); box-shadow: 0 4px 15px rgba(201,112,112,0.3); }
.btn-submit.doc { background: var(--sage-dk); }
.btn-submit.doc:hover:not(:disabled) { background: #4a7060; transform: translateY(-1px); box-shadow: 0 4px 15px rgba(94,136,112,0.3); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.btn-primary:active, .btn-secondary:active, .btn-submit:active:not(:disabled) { transform: scale(0.98); }

.msg-error { font-size: 0.85rem; color: #b94040; background: #fdeaea; padding: 0.8rem 1rem; border-radius: var(--radius-md); border: 1px solid #f0c0c0; display: flex; align-items: center; gap: 0.5rem; }
.msg-success { font-size: 0.85rem; color: var(--sage-dk); background: #e8f5ec; padding: 0.8rem 1rem; border-radius: var(--radius-md); border: 1px solid #b8dcc4; display: flex; align-items: center; gap: 0.5rem; }
.hint { font-size: 0.8rem; color: var(--muted); margin-top: -0.2rem; }

@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .hero h1 { font-size: 2.2rem; }
  .section { padding: 4rem 5%; }
  .auth-card { padding: 2rem 1.5rem; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
`;
