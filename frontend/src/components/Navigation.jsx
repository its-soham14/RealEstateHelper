import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../context/SearchContext';

const Navigation = ({ currentUser, logout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { searchQuery, setSearchQuery } = useSearch();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navClasses = [
        'reb-navbar',
        scrolled ? 'scrolled' : '',
        !isHomePage ? 'light-mode' : '',
    ].filter(Boolean).join(' ');

    // On home page, text is always white (dark hero behind nav)
    // On other pages, light-mode class handles the coloring
    const textColor = isHomePage ? 'rgba(255,255,255,0.85)' : '#000';
    const logoColor = '#ffffff'; // ALWAYS white

    return (
        <>
            <nav className={navClasses} style={{ padding: '0 2rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    maxWidth: '1280px',
                    margin: '0 auto',
                }}>
                    {/* Logo */}
                    <Link to="/" className="nav-logo" style={{ color: logoColor }}>
                        REH
                    </Link>

                    {/* Search bar — buyers only, desktop */}
                    {currentUser?.role === 'BUYER' && (
                        <div style={{
                            flex: 1,
                            maxWidth: 360,
                            margin: '0 2rem',
                            display: 'none',
                        }} className="d-none d-lg-block">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: 100,
                                padding: '0.4rem 1rem',
                                gap: '0.5rem',
                            }}>
                                <Search size={15} color="rgba(255,255,255,0.5)" />
                                <input
                                    type="text"
                                    placeholder="Search city or area..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        color: '#fff',
                                        fontSize: '0.875rem',
                                        width: '100%',
                                        fontFamily: 'var(--font-sans)',
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Desktop Nav */}
                    <div className="d-none d-lg-flex" style={{ alignItems: 'center', gap: '2rem' }}>
                        {!currentUser && (
                            <>
                                <Link to="/" className="nav-link-item" style={{ color: textColor }}>
                                    Home
                                </Link>
                            </>
                        )}

                        {currentUser?.role === 'BUYER'  && <Link to="/buyer"  className="nav-link-item" style={{ color: textColor }}>Dashboard</Link>}
                        {currentUser?.role === 'SELLER' && <Link to="/seller" className="nav-link-item" style={{ color: textColor }}>Listings</Link>}
                        {currentUser?.role === 'ADMIN'  && <Link to="/admin"  className="nav-link-item" style={{ color: textColor }}>Admin</Link>}

                        {currentUser ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Link to="/profile" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: textColor,
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    transition: 'opacity 0.2s',
                                }}>
                                    <div style={{
                                        width: 32, height: 32,
                                        borderRadius: '50%',
                                        background: isHomePage ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: isHomePage ? '#fff' : '#000',
                                    }}>
                                        {currentUser.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span style={{ color: textColor }}>{currentUser.name?.split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="reb-btn"
                                    style={{
                                        background: isHomePage ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
                                        color: isHomePage ? '#fff' : '#000',
                                        padding: '0.45rem 1rem',
                                        borderRadius: 100,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    <LogOut size={14} /> Sign out
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Link to="/login" className="reb-btn reb-btn-outline"
                                    style={{ color: isHomePage ? '#fff' : '#000', borderColor: isHomePage ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)' }}>
                                    Log in
                                </Link>
                                <Link to="/signup" className="reb-btn reb-btn-white" style={{ color: '#000' }}>
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="d-flex d-lg-none reb-btn"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{
                            background: 'transparent',
                            color: logoColor,
                            padding: '0.5rem',
                        }}
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'fixed',
                            top: 'var(--navbar-height)',
                            left: 0, right: 0,
                            background: 'rgba(0,0,0,0.97)',
                            backdropFilter: 'blur(20px)',
                            zIndex: 999,
                            padding: '1.5rem 2rem 2rem',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {!currentUser && (
                                <Link to="/" style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Home</Link>
                            )}
                            {currentUser?.role === 'BUYER'  && <Link to="/buyer"  style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>Dashboard</Link>}
                            {currentUser?.role === 'SELLER' && <Link to="/seller" style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>My Listings</Link>}
                            {currentUser?.role === 'ADMIN'  && <Link to="/admin"  style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>Admin Panel</Link>}

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem', display: 'flex', gap: '1rem' }}>
                                {currentUser ? (
                                    <button onClick={handleLogout} className="reb-btn reb-btn-white" style={{ flex: 1, justifyContent: 'center' }}>
                                        <LogOut size={16} /> Sign out
                                    </button>
                                ) : (
                                    <>
                                        <Link to="/login" className="reb-btn reb-btn-outline" style={{ flex: 1, justifyContent: 'center', color: '#fff' }}>Log in</Link>
                                        <Link to="/signup" className="reb-btn reb-btn-white" style={{ flex: 1, justifyContent: 'center' }}>Sign up</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navigation;
