import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, Building2, MapPin, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import API_BASE_URL from '../config/api';

const EASE = [0.16, 1, 0.3, 1];

function AuthInput({ icon: Icon, type, placeholder, value, onChange, name, required, rightEl, as }) {
    const sharedStyle = {
        flex: 1, background: 'transparent', border: 'none', outline: 'none',
        color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.9375rem',
        padding: '0.875rem 0', width: '100%', resize: 'vertical',
    };
    return (
        <div
            style={{
                display: 'flex', alignItems: as === 'textarea' ? 'flex-start' : 'center',
                background: '#111', border: '1px solid #2a2a2a', borderRadius: 10,
                padding: as === 'textarea' ? '0.875rem 1rem' : '0 1rem',
                gap: '0.75rem', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#fff'}
            onBlur={e => e.currentTarget.style.borderColor = '#2a2a2a'}
        >
            {Icon && <Icon size={16} color="#555" style={{ marginTop: as === 'textarea' ? '2px' : 0 }} />}
            {as === 'textarea' ? (
                <textarea name={name} placeholder={placeholder} value={value} onChange={onChange} required={required} rows={2} style={sharedStyle} />
            ) : (
                <input type={type || 'text'} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required} style={sharedStyle} />
            )}
            {rightEl}
        </div>
    );
}

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'BUYER', phone: '', companyName: '', address: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const navigate = useNavigate();

    // Countdown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const id = setInterval(() => setResendCooldown(c => c - 1), 1000);
        return () => clearInterval(id);
    }, [resendCooldown]);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/auth/signup`, formData);
            setSuccess(`OTP sent to ${formData.email}. Please check your inbox.`);
            setStep(2);
            setResendCooldown(60);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const data = err.response.data;
                setError(typeof data === 'object' ? Object.values(data).join(', ') : String(data));
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0 || loading) return;
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/auth/resend-otp`, { email: formData.email });
            setSuccess('New OTP sent! Please check your inbox.');
            setResendCooldown(60);
        } catch (err) {
            setError(err.response?.data || 'Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, { email: formData.email, otp });
            setSuccess('Email verified! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const msg = err.response?.data;
            setError(typeof msg === 'string' ? msg : 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#000',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            fontFamily: 'var(--font-sans)',
        }}>
            {/* Left decorative panel */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="d-none d-lg-flex"
                style={{
                    background: '#000', borderRight: '1px solid #1a1a1a',
                    flexDirection: 'column', justifyContent: 'space-between',
                    padding: '3rem', position: 'relative', overflow: 'hidden',
                }}
            >
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 60%)', pointerEvents: 'none' }} />

                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.04em', textDecoration: 'none' }}>
                    <ArrowLeft size={16} style={{ opacity: 0.5 }} /> REH
                </Link>

                <div>
                    <div style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: '#fff', marginBottom: '1.5rem' }}>
                        Start your<br />
                        <span style={{ color: '#333' }}>real estate</span><br />
                        journey.
                    </div>
                    <p style={{ color: '#555', fontSize: '0.9375rem', lineHeight: 1.7, maxWidth: 340 }}>
                        No hidden fees. No middlemen. Just you and the perfect property.
                    </p>
                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {['Verified listings only', '₹0 brokerage commission', 'Direct seller contact', 'Instant booking'].map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#555' }}>
                                <CheckCircle size={15} color="#fff" />
                                <span style={{ fontSize: '0.9rem' }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ color: '#333', fontSize: '0.8rem' }}>© 2025 RealEstateHelper</div>
            </motion.div>

            {/* Right form panel */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(2rem, 5vw, 4rem)', background: '#000', overflowY: 'auto' }}
            >
                <div style={{ maxWidth: 420, width: '100%', margin: '0 auto', paddingTop: '2rem', paddingBottom: '2rem' }}>

                    {/* Mobile logo */}
                    <Link to="/" className="d-lg-none" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.04em', textDecoration: 'none', marginBottom: '2.5rem' }}>
                        <ArrowLeft size={14} style={{ opacity: 0.5 }} /> REH
                    </Link>

                    {/* Step indicator */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                        {[1, 2].map(s => (
                            <div key={s} style={{ height: 3, flex: 1, borderRadius: 10, background: step >= s ? '#fff' : '#222', transition: 'background 0.4s ease' }} />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: EASE }}>
                                <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', marginBottom: '0.5rem', lineHeight: 1.1 }}>
                                    Create account.
                                </h1>
                                <p style={{ color: '#555', fontSize: '0.9375rem', marginBottom: '2rem' }}>
                                    Already registered?{' '}
                                    <Link to="/login" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
                                </p>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: 8, padding: '0.75rem 1rem', color: '#ff6b6b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* Role selector */}
                                    <div>
                                        <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>I am a</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                            {['BUYER', 'SELLER'].map(role => (
                                                <button key={role} type="button" onClick={() => setFormData({ ...formData, role })}
                                                    style={{ background: formData.role === role ? '#fff' : '#111', color: formData.role === role ? '#000' : '#555', border: '1px solid', borderColor: formData.role === role ? '#fff' : '#2a2a2a', borderRadius: 10, padding: '0.75rem', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                    {role === 'BUYER' ? '🏠 Buyer' : '🏗 Seller'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <div>
                                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Full Name</label>
                                            <AuthInput icon={User} name="name" placeholder="Your name" onChange={handleChange} required />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Phone</label>
                                            <AuthInput icon={Phone} name="phone" placeholder="Mobile" onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email address</label>
                                        <AuthInput icon={Mail} type="email" name="email" placeholder="you@example.com" onChange={handleChange} required />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Password</label>
                                        <AuthInput icon={Lock} type={showPassword ? 'text' : 'password'} name="password" placeholder="Create a password" onChange={handleChange} required
                                            rightEl={
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 0, display: 'flex' }}>
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            }
                                        />
                                    </div>

                                    {formData.role === 'SELLER' && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'hidden' }}>
                                            <div>
                                                <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Company (Optional)</label>
                                                <AuthInput icon={Building2} name="companyName" placeholder="Company name" onChange={handleChange} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Address</label>
                                                <AuthInput icon={MapPin} name="address" placeholder="Business address" onChange={handleChange} as="textarea" required />
                                            </div>
                                        </motion.div>
                                    )}

                                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                        style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 10, padding: '0.9rem', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.9375rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        {loading ? 'Sending OTP...' : <>Send OTP <ArrowRight size={16} /></>}
                                    </motion.button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: EASE }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                        <Mail size={24} color="#fff" />
                                    </div>
                                    <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', marginBottom: '0.5rem' }}>
                                        Check your email.
                                    </h1>
                                    <p style={{ color: '#555', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                                        We sent a 6-digit OTP to{' '}
                                        <span style={{ color: '#fff', fontWeight: 600 }}>{formData.email}</span>.
                                        <br />
                                        <span style={{ fontSize: '0.8rem' }}>Check your spam folder if you don't see it.</span>
                                    </p>
                                </div>

                                <AnimatePresence>
                                    {success && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            style={{ background: 'rgba(60,255,120,0.08)', border: '1px solid rgba(60,255,120,0.2)', borderRadius: 8, padding: '0.75rem 1rem', color: '#4ade80', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                            {success}
                                        </motion.div>
                                    )}
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: 8, padding: '0.75rem 1rem', color: '#ff6b6b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                            One-Time Password
                                        </label>
                                        <input
                                            type="text" value={otp} onChange={e => setOtp(e.target.value)}
                                            required maxLength={6} placeholder="• • • • • •"
                                            style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: '1rem', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '0.4em', textAlign: 'center', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                                            onFocus={e => e.target.style.borderColor = '#fff'}
                                            onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                                        />
                                    </div>

                                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                        style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 10, padding: '0.9rem', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.9375rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        {loading ? 'Verifying...' : <>Verify &amp; Continue <ArrowRight size={16} /></>}
                                    </motion.button>

                                    {/* Resend OTP button */}
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendCooldown > 0 || loading}
                                        style={{
                                            background: 'none', border: '1px solid #2a2a2a', borderRadius: 10,
                                            color: resendCooldown > 0 ? '#333' : '#888',
                                            cursor: resendCooldown > 0 || loading ? 'not-allowed' : 'pointer',
                                            fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                                            padding: '0.75rem',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => { if (resendCooldown === 0) e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = resendCooldown === 0 ? '#fff' : '#333'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = resendCooldown > 0 ? '#333' : '#888'; }}
                                    >
                                        <RefreshCw size={14} />
                                        {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                                    </button>

                                    <button type="button" onClick={() => { setStep(1); setError(''); setOtp(''); }}
                                        style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#555'}>
                                        <ArrowLeft size={14} /> Back to registration
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
