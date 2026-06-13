import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCircle, Save, Edit3, Mail, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config/api';

const EASE = [0.16, 1, 0.3, 1];

// --- Styles ---
const inputStyle = {
    width: '100%',
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: 8,
    padding: '0.85rem 1rem',
    color: '#fff',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
};

const labelStyle = {
    display: 'block',
    color: '#888',
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
    fontWeight: 600
};

const FormGroup = ({ label, children }) => (
    <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>{label}</label>
        {children}
    </div>
);

const Profile = ({ user, setUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        state: '',
        address: '',
        zip: '',
        companyName: ''
    });

    const [editMode, setEditMode] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/api/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const u = res.data;
                setFormData({
                    name: u.name || '',
                    phone: u.phone || '',
                    city: u.city || '',
                    state: u.state || '',
                    address: u.address || '',
                    zip: u.zip || '',
                    companyName: u.companyName || ''
                });
                // Update global user state seamlessly if needed, but form is priority
            } catch (e) {
                console.error("Failed to fetch profile", e);
            }
        };

        if (user) {
            // Initial load from props (fast)
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                city: user.city || '',
                state: user.state || '',
                address: user.address || '',
                zip: user.zip || '',
                companyName: user.companyName || ''
            });
            // Then fetch fresh data (authoritative)
            fetchProfile();
        }
    }, [user.id]); // Dependency on ID to prevent loops

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ ONLY save when Save Changes clicked
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            setNotification({ msg: 'Name cannot be empty.', type: 'error' });
            return;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            setNotification({ msg: 'Phone number must be exactly 10 digits.', type: 'error' });
            return;
        }
        if (formData.zip && !/^\d{6}$/.test(formData.zip)) {
            setNotification({ msg: 'Zip code must be 6 digits.', type: 'error' });
            return;
        }

        const alphaRegex = /^[a-zA-Z\s]+$/;
        if ((formData.city && !alphaRegex.test(formData.city)) ||
            (formData.state && !alphaRegex.test(formData.state)) ||
            (formData.address && !alphaRegex.test(formData.address))) {
            setNotification({ msg: 'Address, City, and State must contain only alphabets.', type: 'error' });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                `${API_BASE_URL}/api/users/profile`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotification({ msg: 'Profile updated successfully!', type: 'success' });
            setEditMode(false);
            setUser({ ...user, ...res.data });
        } catch (e) {
            setNotification({ msg: 'Failed to update profile.', type: 'error' });
        }
    };

    return (
        <div style={{ background: '#000', minHeight: '100vh', paddingTop: 'calc(var(--navbar-height) + 3rem)', paddingBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ width: '100%', maxWidth: 800, padding: '0 1.5rem' }}
            >
                {/* --- Header --- */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div style={{ width: 80, height: 80, background: '#111', border: '1px solid #222', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserCircle size={40} color="#fff" />
                    </div>
                    <div>
                        <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 0.4rem 0' }}>
                            My Profile
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <span style={{ color: '#aaa', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Mail size={14} /> {user.email}
                            </span>
                            <span style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 100, letterSpacing: '0.05em' }}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- Notifications --- */}
                <AnimatePresence>
                    {notification && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                            animate={{ opacity: 1, height: 'auto', marginBottom: '2rem' }} 
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div style={{
                                background: notification.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                border: `1px solid ${notification.type === 'success' ? '#22c55e' : '#ef4444'}`,
                                color: notification.type === 'success' ? '#4ade80' : '#f87171',
                                padding: '1rem 1.25rem',
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}>
                                <AlertCircle size={18} />
                                {notification.msg}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- Form Card --- */}
                <div style={{ background: '#050505', border: '1px solid #1a1a1a', borderRadius: 16, padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            
                            <FormGroup label="Full Name">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    style={{ ...inputStyle, opacity: editMode ? 1 : 0.5, cursor: editMode ? 'text' : 'not-allowed' }}
                                    onFocus={(e) => editMode && (e.currentTarget.style.borderColor = '#666')}
                                    onBlur={(e) => editMode && (e.currentTarget.style.borderColor = '#333')}
                                />
                            </FormGroup>

                            <FormGroup label="Phone Number">
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    style={{ ...inputStyle, opacity: editMode ? 1 : 0.5, cursor: editMode ? 'text' : 'not-allowed' }}
                                    onFocus={(e) => editMode && (e.currentTarget.style.borderColor = '#666')}
                                    onBlur={(e) => editMode && (e.currentTarget.style.borderColor = '#333')}
                                />
                            </FormGroup>

                            <FormGroup label="City">
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    style={{ ...inputStyle, opacity: editMode ? 1 : 0.5, cursor: editMode ? 'text' : 'not-allowed' }}
                                    onFocus={(e) => editMode && (e.currentTarget.style.borderColor = '#666')}
                                    onBlur={(e) => editMode && (e.currentTarget.style.borderColor = '#333')}
                                />
                            </FormGroup>

                            <FormGroup label="State">
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    style={{ ...inputStyle, opacity: editMode ? 1 : 0.5, cursor: editMode ? 'text' : 'not-allowed' }}
                                    onFocus={(e) => editMode && (e.currentTarget.style.borderColor = '#666')}
                                    onBlur={(e) => editMode && (e.currentTarget.style.borderColor = '#333')}
                                />
                            </FormGroup>

                            <FormGroup label="Address">
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    style={{ ...inputStyle, opacity: editMode ? 1 : 0.5, cursor: editMode ? 'text' : 'not-allowed' }}
                                    onFocus={(e) => editMode && (e.currentTarget.style.borderColor = '#666')}
                                    onBlur={(e) => editMode && (e.currentTarget.style.borderColor = '#333')}
                                />
                            </FormGroup>

                            <FormGroup label="Zip Code">
                                <input
                                    type="text"
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    style={{ ...inputStyle, opacity: editMode ? 1 : 0.5, cursor: editMode ? 'text' : 'not-allowed' }}
                                    onFocus={(e) => editMode && (e.currentTarget.style.borderColor = '#666')}
                                    onBlur={(e) => editMode && (e.currentTarget.style.borderColor = '#333')}
                                />
                            </FormGroup>

                            {user.role === 'SELLER' && (
                                <FormGroup label="Company Name">
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                        style={{ ...inputStyle, opacity: editMode ? 1 : 0.5, cursor: editMode ? 'text' : 'not-allowed' }}
                                        onFocus={(e) => editMode && (e.currentTarget.style.borderColor = '#666')}
                                        onBlur={(e) => editMode && (e.currentTarget.style.borderColor = '#333')}
                                    />
                                </FormGroup>
                            )}
                        </div>

                        {/* --- Buttons --- */}
                        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
                            {!editMode ? (
                                <button
                                    type="button"
                                    onClick={() => setEditMode(true)}
                                    style={{
                                        background: '#fff', color: '#000', border: 'none', borderRadius: 8,
                                        padding: '0.875rem 2rem', fontSize: '0.9rem', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                                        transition: 'opacity 0.2s',
                                        width: '100%', maxWidth: 'max-content'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                                    onMouseLeave={e => e.currentTarget.style.opacity = 1}
                                >
                                    <Edit3 size={16} /> Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditMode(false);
                                            // Reset to original data
                                            setFormData({
                                                name: user.name || '', phone: user.phone || '', city: user.city || '',
                                                state: user.state || '', address: user.address || '', zip: user.zip || '',
                                                companyName: user.companyName || ''
                                            });
                                            setNotification(null);
                                        }}
                                        style={{
                                            background: 'transparent', color: '#fff', border: '1px solid #333', borderRadius: 8,
                                            padding: '0.875rem 2rem', fontSize: '0.9rem', fontWeight: 600,
                                            cursor: 'pointer', transition: 'background 0.2s',
                                            width: '100%', maxWidth: 'max-content'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#111'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            background: '#fff', color: '#000', border: 'none', borderRadius: 8,
                                            padding: '0.875rem 2rem', fontSize: '0.9rem', fontWeight: 700,
                                            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                                            transition: 'opacity 0.2s',
                                            width: '100%', maxWidth: 'max-content'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                                        onMouseLeave={e => e.currentTarget.style.opacity = 1}
                                    >
                                        <Save size={16} /> Save Changes
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;

