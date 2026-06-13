import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';
import API_BASE_URL from '../config/api';

const EASE = [0.16, 1, 0.3, 1];

function AuthInput({ icon: Icon, type, placeholder, value, onChange, name, required, rightEl }) {
    const sharedStyle = {
        flex: 1, background: 'transparent', border: 'none', outline: 'none',
        color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.9375rem',
        padding: '0.875rem 0', width: '100%', resize: 'vertical',
    };
    return (
        <div
            style={{
                display: 'flex', alignItems: 'center',
                background: '#111', border: '1px solid #2a2a2a', borderRadius: 10,
                padding: '0 1rem', gap: '0.75rem', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#fff'}
            onBlur={e => e.currentTarget.style.borderColor = '#2a2a2a'}
        >
            {Icon && <Icon size={16} color="#555" />}
            <input type={type || 'text'} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required} style={sharedStyle} />
            {rightEl}
        </div>
    );
}

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const id = setInterval(() => setResendCooldown(c => c - 1), 1000);
        return () => clearInterval(id);
    }, [resendCooldown]);

    const handleSendOtp = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
            setSuccess(`Reset instructions sent to ${email}. Check your inbox.`);
            setStep(2);
            setResendCooldown(60);
        } catch (err) {
            setError(err.response?.data || 'Failed to send reset email.');
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
            await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
            setSuccess('New OTP sent! Please check your inbox.');
            setResendCooldown(60);
        } catch (err) {
            setError(err.response?.data || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { email, otp, newPassword });
            setSuccess('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data || 'Failed to reset password. Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#000',
            display: 'grid', gridTemplateColumns: '1fr',
            fontFamily: 'var(--font-sans)',
        }}>
            {/* Form panel centered */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(2rem, 5vw, 4rem)', background: '#000', overflowY: 'auto' }}
            >
                <div style={{ maxWidth: 420, width: '100%', margin: '0 auto', paddingTop: '2rem', paddingBottom: '2rem' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.04em', textDecoration: 'none', marginBottom: '3rem' }}>
                        <ArrowLeft size={16} style={{ opacity: 0.5 }} /> REH
                    </Link>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: EASE }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                        <KeyRound size={24} color="#fff" />
                                    </div>
                                    <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', marginBottom: '0.5rem', lineHeight: 1.1 }}>
                                        Reset password.
                                    </h1>
                                    <p style={{ color: '#555', fontSize: '0.9375rem' }}>
                                        Enter your email address and we'll send you a 6-digit OTP to reset your password.
                                    </p>
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: 8, padding: '0.75rem 1rem', color: '#ff6b6b', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email address</label>
                                        <AuthInput icon={Mail} type="email" name="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                    </div>

                                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                        style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 10, padding: '0.9rem', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.9375rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        {loading ? 'Sending OTP...' : <>Send Reset OTP <ArrowRight size={16} /></>}
                                    </motion.button>
                                    
                                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                        <Link to="/login" style={{ color: '#555', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <ArrowLeft size={14} /> Back to Login
                                        </Link>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: EASE }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', marginBottom: '0.5rem' }}>
                                        Enter OTP.
                                    </h1>
                                    <p style={{ color: '#555', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                                        We sent a 6-digit OTP to{' '}
                                        <span style={{ color: '#fff', fontWeight: 600 }}>{email}</span>.
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

                                <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

                                    <div>
                                        <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>New Password</label>
                                        <AuthInput icon={Lock} type={showPassword ? 'text' : 'password'} name="newPassword" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                                            rightEl={
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 0, display: 'flex' }}>
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            }
                                        />
                                    </div>

                                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                        style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 10, padding: '0.9rem', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.9375rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        {loading ? 'Resetting...' : <>Reset Password <ArrowRight size={16} /></>}
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

                                    <button type="button" onClick={() => { setStep(1); setError(''); setOtp(''); setNewPassword(''); }}
                                        style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#555'}>
                                        <ArrowLeft size={14} /> Change email address
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

export default ForgotPassword;
