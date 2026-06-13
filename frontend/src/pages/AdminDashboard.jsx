import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Home, CreditCard, Check, X, Trash2, ChevronRight, Building2 } from 'lucide-react';
import PropertyMap from '../components/PropertyMap';
import API_BASE_URL from '../config/api';

const EASE = [0.16, 1, 0.3, 1];

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } }
};
const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } }
};

// ── Dark tab ───────────────────────────────────────────────────
function TabBtn({ active, onClick, label, badge }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '0.5rem 1.25rem',
                background: active ? '#fff' : 'transparent',
                color: active ? '#000' : '#555',
                border: '1px solid',
                borderColor: active ? '#fff' : '#222',
                borderRadius: 100,
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}
        >
            {label}
            {badge !== undefined && (
                <span style={{ background: active ? '#000' : '#222', color: active ? '#fff' : '#888', borderRadius: 100, fontSize: '0.7rem', padding: '1px 7px', fontWeight: 700 }}>
                    {badge}
                </span>
            )}
        </button>
    );
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay }}
            style={{
                background: '#111', border: '1px solid #1a1a1a', borderRadius: 12,
                padding: '1.5rem', flex: '1 1 200px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: 44, height: 44, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color="#fff" />
                </div>
                <div>
                    <div style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                    <div style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
                </div>
            </div>
        </motion.div>
    );
}

// ── Dark table ────────────────────────────────────────────────
const thStyle = {
    padding: '0.75rem 1.25rem',
    color: '#444',
    fontWeight: 600,
    fontSize: '0.72rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    borderBottom: '1px solid #1a1a1a',
    background: '#050505',
    textAlign: 'left',
    whiteSpace: 'nowrap',
};
const tdStyle = {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #111',
    color: '#ccc',
    fontSize: '0.875rem',
    verticalAlign: 'middle',
};

const AdminDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('moderation');
    const [users, setUsers] = useState([]);
    const [pendingProperties, setPendingProperties] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showPropertyModal, setShowPropertyModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
            setUsers(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchPendingProperties = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/properties/pending`, { headers: { Authorization: `Bearer ${token}` } });
            setPendingProperties(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/transactions/all`, { headers: { Authorization: `Bearer ${token}` } });
            setTransactions(res.data);
        } catch (e) { setTransactions([]); }
    };

    useEffect(() => { fetchUsers(); fetchPendingProperties(); fetchTransactions(); }, []);

    const updatePropertyStatus = async (id, status, reason) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/properties/${id}/status`, null, {
                params: { status, reason },
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPendingProperties();
        } catch (e) { console.error(e); }
    };

    const handleApprove = (id) => updatePropertyStatus(id, 'APPROVED');
    const handleReject = (property) => {
        setSelectedPropertyId(property.id);
        setShowRejectModal(true);
    };
    const submitRejection = async () => {
        if (selectedPropertyId) {
            await updatePropertyStatus(selectedPropertyId, 'REJECTED', rejectionReason);
            setShowRejectModal(false);
            setRejectionReason('');
        }
    };
    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user permanently?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchUsers();
        } catch (e) { console.error(e); }
    };

    const EmptyState = ({ msg }) => (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#333', fontSize: '0.9rem' }}>{msg}</div>
    );

    const rolePill = (role) => ({
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 100,
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        background: role === 'ADMIN' ? '#fff' : role === 'SELLER' ? '#1a1a1a' : '#111',
        color: role === 'ADMIN' ? '#000' : '#888',
        border: '1px solid',
        borderColor: role === 'ADMIN' ? '#fff' : '#2a2a2a',
    });

    return (
        <div style={{ background: '#000', minHeight: '100vh', paddingTop: 'var(--navbar-height)', fontFamily: 'var(--font-sans)' }}>

            {/* ── Header ─────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ borderBottom: '1px solid #1a1a1a', padding: '2rem 2.5rem' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <span style={{ color: '#444', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                            Admin Portal
                        </span>
                        <h1 style={{ color: '#fff', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, margin: 0 }}>
                            Control Centre
                        </h1>
                    </div>
                    <div style={{ width: 48, height: 48, background: '#111', border: '1px solid #2a2a2a', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={22} color="#fff" />
                    </div>
                </div>
            </motion.div>

            <div style={{ padding: '2rem 2.5rem' }}>

                {/* ── Stat Cards ─────────────────────────────── */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                    <StatCard icon={Users}      label="Total Users"      value={users.length}               delay={0} />
                    <StatCard icon={Building2}  label="Pending Review"   value={pendingProperties.length}   delay={0.08} />
                    <StatCard icon={CreditCard} label="Transactions"     value={transactions.length}        delay={0.16} />
                </div>

                {/* ── Tabs ───────────────────────────────────── */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <TabBtn active={activeTab === 'moderation'}   onClick={() => setActiveTab('moderation')}   label="Property Approval" badge={pendingProperties.length} />
                    <TabBtn active={activeTab === 'users'}        onClick={() => setActiveTab('users')}        label="Users" badge={users.length} />
                    <TabBtn active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} label="Transactions" badge={transactions.length} />
                </div>

                {/* ── Tab Content ────────────────────────────── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: EASE }}
                    >
                        {/* MODERATION */}
                        {activeTab === 'moderation' && (
                            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, overflow: 'hidden' }}>
                                {pendingProperties.length === 0 ? <EmptyState msg="✓ No pending listings. All caught up." /> : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr>
                                                    <th style={thStyle}>Seller</th>
                                                    <th style={thStyle}>Property</th>
                                                    <th style={thStyle}>Price</th>
                                                    <th style={thStyle}>Type</th>
                                                    <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                                                {pendingProperties.map((p) => (
                                                    <motion.tr key={p.id} variants={staggerItem} style={{ borderBottom: '1px solid #111' }}>
                                                        <td style={tdStyle}>
                                                            <div style={{ color: '#fff', fontWeight: 600 }}>{p.sellerName || 'Unknown'}</div>
                                                            <div style={{ color: '#444', fontSize: '0.75rem' }}>{p.sellerEmail}</div>
                                                        </td>
                                                        <td style={tdStyle}>
                                                            <div style={{ color: '#ccc', fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {p.title || p.address}
                                                            </div>
                                                            <button
                                                                onClick={() => { setSelectedProperty(p); setShowPropertyModal(true); }}
                                                                style={{ background: 'none', border: 'none', color: '#555', fontSize: '0.72rem', cursor: 'pointer', padding: 0, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '2px', marginTop: 4 }}
                                                            >
                                                                View details <ChevronRight size={10} />
                                                            </button>
                                                        </td>
                                                        <td style={{ ...tdStyle, color: '#fff', fontWeight: 700 }}>₹{p.price?.toLocaleString()}</td>
                                                        <td style={tdStyle}>
                                                            <span style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#888', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 100, fontWeight: 600, letterSpacing: '0.06em' }}>
                                                                {p.type}
                                                            </span>
                                                        </td>
                                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                                <button
                                                                    onClick={() => handleApprove(p.id)}
                                                                    style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 8, padding: '0.45rem 1rem', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                                >
                                                                    <Check size={13} /> Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(p)}
                                                                    style={{ background: 'transparent', color: '#555', border: '1px solid #2a2a2a', borderRadius: 8, padding: '0.45rem 0.75rem', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                                >
                                                                    <X size={13} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </motion.tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* USERS */}
                        {activeTab === 'users' && (
                            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, overflow: 'hidden' }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={thStyle}>User</th>
                                                <th style={thStyle}>Contact</th>
                                                <th style={thStyle}>Role</th>
                                                <th style={{ ...thStyle, textAlign: 'right' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                                            {users.map((u) => (
                                                <motion.tr key={u.id} variants={staggerItem}>
                                                    <td style={tdStyle}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                            <div style={{ width: 36, height: 36, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                                                                {u.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span style={{ color: '#fff', fontWeight: 600 }}>{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <div style={{ color: '#666', fontSize: '0.8rem' }}>{u.email}</div>
                                                        {u.phone && <div style={{ color: '#444', fontSize: '0.75rem' }}>{u.phone}</div>}
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <span style={rolePill(u.role)}>{u.role}</span>
                                                    </td>
                                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                        {u.role !== 'ADMIN' && (
                                                            <button
                                                                onClick={() => handleDeleteUser(u.id)}
                                                                style={{ background: 'none', border: '1px solid #2a2a2a', color: '#555', borderRadius: 8, padding: '0.35rem 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', marginLeft: 'auto' }}
                                                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff4444'; e.currentTarget.style.color = '#ff4444'; }}
                                                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#555'; }}
                                                            >
                                                                <Trash2 size={13} /> Remove
                                                            </button>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </motion.tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TRANSACTIONS */}
                        {activeTab === 'transactions' && (
                            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, overflow: 'hidden' }}>
                                {transactions.length === 0 ? <EmptyState msg="No transactions yet." /> : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr>
                                                    <th style={thStyle}>Transaction ID</th>
                                                    <th style={thStyle}>Property</th>
                                                    <th style={thStyle}>Parties</th>
                                                    <th style={thStyle}>Amount (5%)</th>
                                                    <th style={thStyle}>Date</th>
                                                </tr>
                                            </thead>
                                            <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                                                {transactions.map((t) => (
                                                    <motion.tr key={t.id} variants={staggerItem}>
                                                        <td style={tdStyle}>
                                                            <code style={{ color: '#444', fontSize: '0.72rem', fontFamily: 'monospace' }}>{t.transactionId}</code>
                                                        </td>
                                                        <td style={{ ...tdStyle, color: '#ccc', fontWeight: 500, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {t.property?.title}
                                                        </td>
                                                        <td style={tdStyle}>
                                                            <div style={{ color: '#666', fontSize: '0.78rem' }}>B: {t.buyer?.name}</div>
                                                            <div style={{ color: '#444', fontSize: '0.78rem' }}>S: {t.seller?.name}</div>
                                                        </td>
                                                        <td style={{ ...tdStyle, color: '#fff', fontWeight: 700 }}>₹ {t.amount?.toLocaleString()}</td>
                                                        <td style={{ ...tdStyle, color: '#555', fontSize: '0.8rem' }}>
                                                            {new Date(t.paymentDate).toLocaleDateString('en-IN')}
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </motion.tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Property Detail Modal ───────────────────────── */}
            <AnimatePresence>
                {showPropertyModal && selectedProperty && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowPropertyModal(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1200 }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
                            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-45%' }}
                            transition={{ duration: 0.3, ease: EASE }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%',
                                background: '#0a0a0a', border: '1px solid #1a1a1a',
                                borderRadius: 16, width: '90%', maxWidth: 680,
                                zIndex: 1300, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: '90vh'
                            }}
                        >
                            <div style={{ overflowY: 'auto', flex: 1, overscrollBehavior: 'contain', scrollBehavior: 'smooth' }}>
                                <div style={{ position: 'relative', height: 280 }}>
                                    <img
                                        src={(() => {
                                            let imgStr = selectedProperty.images ? selectedProperty.images.split(',')[0].trim() : '';
                                            if (!imgStr) return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
                                            return imgStr.startsWith('http') ? imgStr : `${API_BASE_URL}/uploads/${imgStr}`;
                                        })()}
                                        alt="Property"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }}
                                    />
                                    <button
                                        onClick={() => setShowPropertyModal(false)}
                                        style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h2 style={{ color: '#fff', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>{selectedProperty.title}</h2>
                                            <p style={{ color: '#555', fontSize: '0.875rem', marginTop: 4 }}>{selectedProperty.address}, {selectedProperty.city}</p>
                                        </div>
                                        <span style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 900 }}>₹{selectedProperty.price?.toLocaleString()}</span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        {[['Area', `${selectedProperty.area} sqft`], ['Beds', selectedProperty.beds || '—'], ['Baths', selectedProperty.baths || '—'], ['Type', selectedProperty.type]].map(([k, v]) => (
                                            <div key={k} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 8, padding: '0.75rem', textAlign: 'center' }}>
                                                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{v}</div>
                                                <div style={{ color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{k}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: '1.5rem' }}>
                                        <PropertyMap location={`${selectedProperty.address}, ${selectedProperty.city}`} />
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                        <button
                                            onClick={() => { setShowPropertyModal(false); handleReject(selectedProperty); }}
                                            style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#888', borderRadius: 8, padding: '0.65rem 1.5rem', fontFamily: 'var(--font-sans)', fontWeight: 600, cursor: 'pointer' }}
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => { setShowPropertyModal(false); handleApprove(selectedProperty.id); }}
                                            style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 8, padding: '0.65rem 1.5rem', fontFamily: 'var(--font-sans)', fontWeight: 700, cursor: 'pointer' }}
                                        >
                                            Approve Listing
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Rejection Reason Modal ──────────────────────── */}
            <AnimatePresence>
                {showRejectModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowRejectModal(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1400 }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
                            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
                            transition={{ duration: 0.25, ease: EASE }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%',
                                background: '#0a0a0a', border: '1px solid #1a1a1a',
                                borderRadius: 14, width: '90%', maxWidth: 460, zIndex: 1500, padding: '1.75rem',
                            }}
                        >
                            <h3 style={{ color: '#fff', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Rejection Reason</h3>
                            <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Explain why this listing is being rejected.</p>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="e.g. Missing images, incorrect pricing..."
                                rows={4}
                                style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: '0.75rem', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }}
                            />
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    style={{ background: 'transparent', border: '1px solid #2a2a2a', color: '#666', borderRadius: 8, padding: '0.6rem 1.25rem', fontFamily: 'var(--font-sans)', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitRejection}
                                    disabled={!rejectionReason}
                                    style={{ background: rejectionReason ? '#fff' : '#222', color: rejectionReason ? '#000' : '#555', border: 'none', borderRadius: 8, padding: '0.6rem 1.5rem', fontFamily: 'var(--font-sans)', fontWeight: 700, cursor: rejectionReason ? 'pointer' : 'not-allowed' }}
                                >
                                    Reject Listing
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
