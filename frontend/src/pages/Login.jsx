import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import API_BASE_URL from '../config/api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const EASE = [0.16, 1, 0.3, 1];

// Minimal input component
function AuthInput({ icon: Icon, type, placeholder, value, onChange, required, rightEl }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#111',
            border: '1px solid #2a2a2a',
            borderRadius: 10,
            padding: '0 1rem',
            gap: '0.75rem',
            transition: 'border-color 0.2s',
        }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#fff'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#2a2a2a'}
        >
            {Icon && <Icon size={16} color="#555" />}
            <input
                type={type || 'text'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9375rem',
                    padding: '0.875rem 0',
                }}
            />
            {rightEl}
        </div>
    );
}

const Login = ({ setCurrentUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
            const { token, id, name, role, verified } = response.data; // note: backend sends "verified" for boolean isVerified sometimes, let's use response.data directly or check the exact name.
            const user = { id, name, email, role, token, isVerified: response.data.verified ?? response.data.isVerified };
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            setCurrentUser(user);
            if (role === 'BUYER') navigate('/buyer');
            else if (role === 'SELLER') navigate('/seller');
            else if (role === 'ADMIN') navigate('/admin');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const data = err.response.data;
                setError(typeof data === 'object' ? Object.values(data).join(', ') : String(data));
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            const response = await axios.post(`${API_BASE_URL}/api/auth/google`, { token: credential });
            const { token, id, name, role, email: gEmail, verified } = response.data;
            const user = { id, name, email: gEmail, role, token, isVerified: response.data.verified ?? response.data.isVerified };
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            setCurrentUser(user);
            if (role === 'BUYER') navigate('/buyer');
            else if (role === 'SELLER') navigate('/seller');
            else if (role === 'ADMIN') navigate('/admin');
        } catch {
            setError('Google Login failed. Please try again.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#000',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            fontFamily: 'var(--font-sans)',
        }}>
            {/* Left panel — branding */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="d-none d-lg-flex"
                style={{
                    background: '#000',
                    borderRight: '1px solid #1a1a1a',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '3rem',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background texture */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.03) 0%, transparent 60%)',
                    pointerEvents: 'none',
                }} />

                <Link to="/" style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    color: '#fff', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.04em',
                    textDecoration: 'none',
                }}>
                    <ArrowLeft size={16} style={{ opacity: 0.5 }} /> REH
                </Link>

                <div>
                    {/* Large decorative quote */}
                    <div style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        fontWeight: 900,
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                        color: '#fff',
                        marginBottom: '1.5rem',
                    }}>
                        Find your<br />
                        <span style={{ color: '#333' }}>perfect</span><br />
                        property.
                    </div>
                    <p style={{ color: '#555', fontSize: '0.9375rem', lineHeight: 1.7, maxWidth: 340 }}>
                        Join thousands of buyers and sellers on India's most transparent real estate platform.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>12K+</div>
                        <div style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Properties</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>₹0</div>
                        <div style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Brokerage</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>48hrs</div>
                        <div style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Avg deal</div>
                    </div>
                </div>
            </motion.div>

            {/* Right panel — form */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: 'clamp(2rem, 5vw, 4rem)',
                    background: '#000',
                }}
            >
                <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>

                    {/* Mobile logo */}
                    <Link to="/" className="d-lg-none" style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        color: '#fff', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.04em',
                        textDecoration: 'none', marginBottom: '2.5rem',
                    }}>
                        <ArrowLeft size={14} style={{ opacity: 0.5 }} /> REH
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
                    >
                        <h1 style={{
                            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                            fontWeight: 900,
                            letterSpacing: '-0.04em',
                            color: '#fff',
                            marginBottom: '0.5rem',
                            lineHeight: 1.1,
                        }}>
                            Welcome back.
                        </h1>
                        <p style={{ color: '#555', fontSize: '0.9375rem', marginBottom: '2.5rem' }}>
                            Don't have an account?{' '}
                            <Link to="/signup" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>
                                Sign up free
                            </Link>
                        </p>
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    background: 'rgba(255,60,60,0.1)',
                                    border: '1px solid rgba(255,60,60,0.3)',
                                    borderRadius: 8,
                                    padding: '0.75rem 1rem',
                                    color: '#ff6b6b',
                                    fontSize: '0.875rem',
                                    marginBottom: '1.25rem',
                                }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.form
                        onSubmit={handleLogin}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                        <div>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                Email address
                            </label>
                            <AuthInput
                                icon={Mail}
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                Password
                            </label>
                            <AuthInput
                                icon={Lock}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                rightEl={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 0, display: 'flex' }}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                }
                            />
                            <div style={{ textAlign: 'right', marginTop: '0.4rem' }}>
                                <Link to="/forgot-password" style={{ color: '#888', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                background: '#fff',
                                color: '#000',
                                border: 'none',
                                borderRadius: 10,
                                padding: '0.9rem',
                                fontFamily: 'var(--font-sans)',
                                fontWeight: 700,
                                fontSize: '0.9375rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                marginTop: '0.5rem',
                                transition: 'background 0.2s',
                            }}
                        >
                            {loading ? 'Signing in...' : <>Continue <ArrowRight size={16} /></>}
                        </motion.button>
                    </motion.form>

                    {/* Google Login — only shown if VITE_GOOGLE_CLIENT_ID is configured */}
                    {GOOGLE_CLIENT_ID && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0' }}>
                                <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
                                <span style={{ color: '#444', fontSize: '0.8rem', letterSpacing: '0.06em' }}>OR</span>
                                <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => setError('Google Login failed.')}
                                        shape="rectangular"
                                        theme="filled_black"
                                        size="large"
                                        width="100%"
                                    />
                                </GoogleOAuthProvider>
                            </div>
                        </>
                    )}

                    <p style={{ textAlign: 'center', color: '#444', fontSize: '0.8rem', marginTop: '2rem' }}>
                        © 2025 RealEstateHelper
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
