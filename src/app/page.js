'use client';

// src/app/page.js

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { css } from './auth-styles';

export default function HomePage() {
  const router = useRouter();

  const [role,     setRole]     = useState(null);
  const [mode,     setMode]     = useState('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  // OTP states
  const [otpCode,       setOtpCode]       = useState('');
  const [otpSent,       setOtpSent]       = useState(false);
  const [otpVerified,   setOtpVerified]   = useState(false);
  const [otpLoading,    setOtpLoading]    = useState(false);
  const [otpError,      setOtpError]      = useState('');
  const [otpSuccess,    setOtpSuccess]    = useState('');

  function selectRole(r) {
    setRole(r); setMode('login');
    resetForm();
    document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
  }
  function selectMode(m) {
    setMode(m);
    resetForm();
  }
  function resetForm() {
    setEmail(''); setPassword(''); setError(''); setSuccess('');
    setOtpCode(''); setOtpSent(false); setOtpVerified(false);
    setOtpError(''); setOtpSuccess('');
  }

  // Gửi OTP
  async function handleSendOtp() {
    if (!email) { setOtpError('Vui lòng nhập email trước.'); return; }
    setOtpLoading(true); setOtpError(''); setOtpSuccess('');
    try {
      const res  = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email }),
      });
      const data = await res.json();
      if (!res.ok) { setOtpError(data.error || 'Không thể gửi OTP.'); return; }
      setOtpSent(true);
      setOtpVerified(false);
      setOtpSuccess('Đã gửi mã OTP đến email của bạn. Kiểm tra hộp thư (kể cả Spam).');
    } catch {
      setOtpError('Không thể kết nối máy chủ.');
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    try {
      const body = { action: mode, email, password, role };
      if (mode === 'register') {
        body.otp_code = otpCode;
      }

      const res  = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        return;
      }

      const { user } = data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('role',         user.role);
        localStorage.setItem('email',        user.email);
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
      <div className="bg-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
      </div>

      <nav className="navbar">
        <div className="nav-brand"><span>🌸</span> MamaTrack</div>
        <div>
          <button className="btn-secondary" onClick={() => { setRole('doctor'); setMode('login'); document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
            Dành cho bác sĩ
          </button>
        </div>
      </nav>

      <section className="hero">
        <h1>Đồng hành cùng mẹ trong từng tuần thai kỳ</h1>
        <p>Theo dõi sức khỏe thai kỳ, ghi chú thay đổi cơ thể, quản lý việc cần làm và nhận lịch khám từ bác sĩ trong một nơi duy nhất.</p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => selectRole('mom')}>
            Bắt đầu ngay
          </button>
          <button className="btn-secondary" onClick={() => selectRole('doctor')}>
            Dành cho bác sĩ
          </button>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--white)' }}>
        <h2 className="section-title">Dành cho Mẹ bầu</h2>
        <p className="section-subtitle">Mọi công cụ bạn cần để có một thai kỳ khỏe mạnh và an tâm.</p>
        <div className="feature-grid">
          <div className="feature-card mom-card">
            <span className="feature-icon">📈</span>
            <h3 className="feature-title">Theo dõi thai kỳ</h3>
            <p className="feature-desc">Ghi nhận chỉ số cân nặng, huyết áp, tâm trạng và thai máy mỗi tuần.</p>
          </div>
          <div className="feature-card mom-card">
            <span className="feature-icon">📝</span>
            <h3 className="feature-title">Việc cần làm</h3>
            <p className="feature-desc">Lên danh sách chuẩn bị đồ sơ sinh, mua sắm và những việc quan trọng khác.</p>
          </div>
          <div className="feature-card mom-card">
            <span className="feature-icon">🗓️</span>
            <h3 className="feature-title">Lịch khám sắp tới</h3>
            <p className="feature-desc">Nhận lịch siêu âm, khám định kỳ trực tiếp từ bác sĩ chuyên khoa.</p>
          </div>
          <div className="feature-card mom-card">
            <span className="feature-icon">💬</span>
            <h3 className="feature-title">Trợ lý AI đồng hành</h3>
            <p className="feature-desc">Luôn có người bạn AI sẵn sàng giải đáp thắc mắc và tâm sự cùng mẹ.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--sage-lt)' }}>
        <h2 className="section-title" style={{ color: 'var(--sage-dk)' }}>Dành cho Bác sĩ</h2>
        <p className="section-subtitle">Quản lý hồ sơ bệnh nhân một cách khoa học và bảo mật.</p>
        <div className="feature-grid">
          <div className="feature-card doc-card">
            <span className="feature-icon">👥</span>
            <h3 className="feature-title">Quản lý bệnh nhân</h3>
            <p className="feature-desc">Theo dõi danh sách bệnh nhân dựa trên mã kết nối riêng biệt.</p>
          </div>
          <div className="feature-card doc-card">
            <span className="feature-icon">📊</span>
            <h3 className="feature-title">Xem biểu đồ thai kỳ</h3>
            <p className="feature-desc">Trực quan hóa dữ liệu theo dõi sức khỏe của từng bệnh nhân qua các tuần.</p>
          </div>
          <div className="feature-card doc-card">
            <span className="feature-icon">📅</span>
            <h3 className="feature-title">Lên lịch khám</h3>
            <p className="feature-desc">Chủ động hẹn lịch khám, siêu âm và đồng bộ ngay lập tức cho mẹ bầu.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Quy trình sử dụng đơn giản</h2>
        <p className="section-subtitle">Chỉ với vài thao tác, MamaTrack đã sẵn sàng đồng hành cùng bạn.</p>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <h3 className="step-title">Tạo tài khoản</h3>
            <p className="step-desc">Đăng ký bằng email và mã OTP an toàn.</p>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <h3 className="step-title">Nhập thông tin</h3>
            <p className="step-desc">Cập nhật các chỉ số sức khỏe thai kỳ mỗi tuần.</p>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <h3 className="step-title">Bác sĩ theo dõi</h3>
            <p className="step-desc">Cung cấp mã bệnh nhân để bác sĩ cùng theo dõi.</p>
          </div>
          <div className="process-step">
            <div className="step-number">4</div>
            <h3 className="step-title">Nhận lịch khám</h3>
            <p className="step-desc">Đi khám đúng hạn theo lịch hẹn của bác sĩ.</p>
          </div>
        </div>
      </section>

      <section id="auth-section" className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Chào mừng bạn</h2>
            <p>Vui lòng chọn vai trò để tiếp tục</p>
          </div>

          <div className="roles">
            <button
              type="button"
              className={`role-btn${isMom ? ' active-mom' : ''}`}
              onClick={() => selectRole('mom')}
            >
              <span className="icon">🤰</span>
              <span className="label">Bà bầu</span>
            </button>
            <button
              type="button"
              className={`role-btn${isDoc ? ' active-doc' : ''}`}
              onClick={() => selectRole('doctor')}
            >
              <span className="icon">👨‍⚕️</span>
              <span className="label">Bác sĩ</span>
            </button>
          </div>

          {role && (
            <>
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
                <div className="field-group">
                  <label>Email</label>
                  <input
                    type="email" required
                    placeholder="Địa chỉ email của bạn"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label>Mật khẩu</label>
                  <input
                    type="password" required
                    placeholder="Ít nhất 6 ký tự"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>

                {mode === 'register' && (
                  <div className="field-group">
                    <label>Xác thực Email</label>
                    <div className="otp-row">
                      <input
                        type="text"
                        placeholder="Mã OTP 6 số"
                        maxLength={6}
                        value={otpCode}
                        onChange={e => { setOtpCode(e.target.value); setOtpError(''); }}
                      />
                      <button
                        type="button"
                        className={`btn-otp${isDoc ? ' doc' : ''}`}
                        onClick={handleSendOtp}
                        disabled={otpLoading || !email}
                      >
                        {otpLoading ? '⏳' : otpSent ? 'Gửi lại mã' : 'Nhận mã OTP'}
                      </button>
                    </div>
                    {otpError   && <p className="hint" style={{ color: '#b94040' }}>{otpError}</p>}
                    {otpSuccess && <p className="hint" style={{ color: 'var(--sage-dk)' }}>{otpSuccess}</p>}
                  </div>
                )}

                {error   && <div className="msg-error"><span>⚠️</span> {error}</div>}
                {success && <div className="msg-success"><span>✓</span> {success}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-submit ${accentRole}`}
                >
                  {loading
                    ? 'Đang xử lý…'
                    : mode === 'login' ? 'Đăng nhập vào hệ thống' : 'Tạo tài khoản mới'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </>
  );
}