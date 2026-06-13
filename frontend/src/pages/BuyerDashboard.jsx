import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, Home, Heart, Calendar, RotateCcw, MapPin, Bed, Bath, ArrowUpRight, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import PriceRangeSlider from '../components/PriceRangeSlider';
import PropertyCard from '../components/PropertyCard';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const EASE = [0.16, 1, 0.3, 1];

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};
const staggerItem = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } }
};

// ── Dark tab button ───────────────────────────────────────────
function TabBtn({ active, onClick, icon: Icon, label, count }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                background: active ? '#fff' : 'transparent',
                color: active ? '#000' : '#555',
                border: '1px solid',
                borderColor: active ? '#fff' : '#222',
                borderRadius: 100,
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
            }}
        >
            <Icon size={15} />
            {label}
            {count !== undefined && (
                <span style={{
                    background: active ? '#000' : '#222',
                    color: active ? '#fff' : '#888',
                    borderRadius: 100,
                    fontSize: '0.7rem',
                    padding: '1px 7px',
                    fontWeight: 700,
                }}>
                    {count}
                </span>
            )}
        </button>
    );
}

// ── Black filter input ────────────────────────────────────────
function FilterInput({ label, children }) {
    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
                display: 'block', color: '#aaa',
                fontSize: '0.72rem', letterSpacing: '0.12em',
                textTransform: 'uppercase', marginBottom: '0.5rem',
                fontWeight: 600
            }}>
                {label}
            </label>
            {children}
        </div>
    );
}

const selectStyle = {
    width: '100%', background: '#0d0d0d', border: '1px solid #333',
    borderRadius: 8, padding: '0.65rem 0.875rem', color: '#e0e0e0',
    fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none',
    appearance: 'none', cursor: 'pointer',
};

const BuyerDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('properties');
    const [properties, setProperties] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { searchQuery, setSearchQuery } = useSearch();
    const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', type: '', beds: '' });

    const fetchProperties = async () => {
        try {
            const params = {};
            if (searchQuery) params.city = searchQuery;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.type) params.type = filters.type;
            if (filters.beds) params.beds = filters.beds;
            const res = await axios.get(`${API_BASE_URL}/api/properties`, { params });
            setProperties(res.data.content ? res.data.content : res.data);
        } catch (e) { setProperties([]); }
    };

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.get(`${API_BASE_URL}/api/likes/wishlist`, { headers: { Authorization: `Bearer ${token}` } });
            setWishlist(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/transactions/buyer`, { headers: { Authorization: `Bearer ${token}` } });
            setBookings(res.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchProperties();
        fetchWishlist();
        fetchBookings();
    }, [filters, searchQuery]);

    const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
    const resetFilters = () => { setFilters({ minPrice: '', maxPrice: '', type: '', beds: '' }); setSearchQuery(''); };

    // ── Sidebar ──────────────────────────────────────────────
    const Sidebar = () => (
        <div style={{
            background: '#000', borderRight: '1px solid #1a1a1a',
            padding: '2rem',
            height: '100%',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                <Filter size={16} color="#fff" />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Filters
                </span>
            </div>

            {/* Search */}
            <FilterInput label="City / Area">
                <div style={{ display: 'flex', alignItems: 'center', background: '#0a0a0a', border: '1px solid #ffffff', borderRadius: 8, padding: '0 0.75rem', gap: '0.5rem' }}>
                    <Search size={14} color="#555" />
                    <input
                        type="text" placeholder="e.g. Mumbai"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ ...selectStyle, border: 'none', padding: '0.65rem 0', background: 'transparent' }}
                    />
                </div>
            </FilterInput>

            <FilterInput label="Property Type">
                <select name="type" value={filters.type} onChange={handleFilterChange} style={selectStyle}>
                    <option value="">All Types</option>
                    <option value="HOUSE">House</option>
                    <option value="LAND">Land</option>
                    <option value="FARM">Farm</option>
                    <option value="FARMLAND">Farmland</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="VILLA">Villa</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="RESIDENTIAL_PLOT">Residential Plot</option>
                    <option value="PG_HOSTEL">PG / Hostel</option>
                    <option value="OTHER">Other</option>
                </select>
            </FilterInput>

            <FilterInput label="Price Range (₹)">
                <div style={{ padding: '0.25rem 0' }}>
                    <PriceRangeSlider
                        min={0} max={50000000}
                        onChange={(min, max) => setFilters(prev => ({ ...prev, minPrice: min.toString(), maxPrice: max.toString() }))}
                    />
                </div>
            </FilterInput>

            {filters.type === 'HOUSE' && (
                <FilterInput label="Min Bedrooms">
                    <input type="number" name="beds" placeholder="e.g. 2" onChange={handleFilterChange} style={selectStyle} />
                </FilterInput>
            )}

            <button
                onClick={resetFilters}
                style={{
                    width: '100%', background: 'transparent', border: '1px solid #2a2a2a',
                    borderRadius: 8, padding: '0.65rem', color: '#555',
                    fontFamily: 'var(--font-sans)', fontSize: '0.8rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#555'; }}
            >
                <RotateCcw size={14} /> Reset Filters
            </button>
        </div>
    );

    // ── Empty state ───────────────────────────────────────────
    const EmptyState = ({ msg }) => (
        <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>◻</div>
            <p style={{ color: '#555', fontSize: '0.9375rem' }}>{msg}</p>
        </div>
    );

    return (
        <div style={{ background: '#000', minHeight: '100vh', paddingTop: 'var(--navbar-height)', display: 'flex', flexDirection: 'column' }}>

            {/* ── Header ─────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ borderBottom: '1px solid #1a1a1a', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
            >
                <div>
                    <p style={{ color: '#555', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Buyer Dashboard
                    </p>
                    <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                        Good day, {user?.name?.split(' ')[0]}
                    </h1>
                </div>

                {/* Tab Pills */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <TabBtn active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} icon={Home} label="Properties" count={properties.length} />
                    <TabBtn active={activeTab === 'wishlist'}   onClick={() => setActiveTab('wishlist')}   icon={Heart} label="Saved" count={wishlist.length} />
                    <TabBtn active={activeTab === 'bookings'}   onClick={() => setActiveTab('bookings')}   icon={Calendar} label="Bookings" count={bookings.length} />
                </div>
            </motion.div>

            {/* ── Body ───────────────────────────────────────── */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Sidebar — desktop */}
                <aside className="d-none d-lg-block" style={{ width: 260, flexShrink: 0, borderRight: '1px solid #1a1a1a', overflowY: 'auto' }}>
                    {Sidebar()}
                </aside>

                {/* Main */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 2.5rem' }}>

                    {/* Mobile filter btn */}
                    <button
                        className="d-lg-none"
                        onClick={() => setSidebarOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111', border: '1px solid #2a2a2a', color: '#fff', borderRadius: 8, padding: '0.5rem 1rem', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', cursor: 'pointer', marginBottom: '1.5rem' }}
                    >
                        <Filter size={15} /> Filters
                    </button>

                    <AnimatePresence mode="wait">

                        {/* Properties Tab */}
                        {activeTab === 'properties' && (
                            <motion.div key="props" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                {properties.length === 0 ? <EmptyState msg="No properties found. Try adjusting your filters." /> : (
                                    <motion.div
                                        variants={staggerContainer} initial="hidden" animate="visible"
                                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}
                                    >
                                        {properties.map((p) => (
                                            <motion.div key={p.id} variants={staggerItem}>
                                                <PropertyCard property={p} user={user} onLikeToggle={fetchWishlist} />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <motion.div key="wish" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                {wishlist.length === 0 ? <EmptyState msg="No saved properties yet. Start exploring!" /> : (
                                    <motion.div
                                        variants={staggerContainer} initial="hidden" animate="visible"
                                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}
                                    >
                                        {wishlist.map((p) => (
                                            <motion.div key={p.id} variants={staggerItem}>
                                                <PropertyCard property={p} user={user} onLikeToggle={fetchWishlist} />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Bookings Tab */}
                        {activeTab === 'bookings' && (
                            <motion.div key="book" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                {bookings.length === 0 ? <EmptyState msg="No bookings yet." /> : (
                                    <motion.div
                                        variants={staggerContainer} initial="hidden" animate="visible"
                                        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                                    >
                                        {bookings.map((b) => (
                                            <motion.div key={b.id} variants={staggerItem}>
                                                <div style={{
                                                    background: '#111', border: '1px solid #222',
                                                    borderRadius: 12, padding: '1.5rem',
                                                    display: 'flex', justifyContent: 'space-between',
                                                    alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ width: 48, height: 48, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Home size={20} color="#fff" />
                                                        </div>
                                                        <div>
                                                            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9375rem' }}>{b.property?.title || 'Property'}</div>
                                                            <div style={{ color: '#555', fontSize: '0.8rem', marginTop: 2 }}>
                                                                {new Date(b.paymentDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ color: '#fff', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
                                                            ₹ {b.amount?.toLocaleString()}
                                                        </div>
                                                        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#fff', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 10px', borderRadius: 100, marginTop: 6, display: 'inline-block' }}>
                                                            Confirmed · 5% Token
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1100 }}
                        />
                        <motion.div
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ duration: 0.35, ease: EASE }}
                            style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 280, zIndex: 1200, overflowY: 'auto' }}
                        >
                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1 }}>
                                <button onClick={() => setSidebarOpen(false)} style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                                    <X size={16} />
                                </button>
                            </div>
                            {Sidebar()}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BuyerDashboard;
