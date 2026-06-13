import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Bed, Bath, Maximize, Home, ArrowLeft,
    CreditCard, Phone, Mail, MessageCircle, CheckCircle,
    X, Share2, Star, StarHalf
} from 'lucide-react';
import PropertyMap from '../components/PropertyMap';
import API_BASE_URL from '../config/api';

const EASE = [0.16, 1, 0.3, 1];

const PropertyDetails = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [property, setProperty] = useState(null);
    const [showPayModal, setShowPayModal] = useState(false);
    const [payStatus, setPayStatus] = useState('');
    const [contactMsg, setContactMsg] = useState('');
    const [activeImg, setActiveImg] = useState(0);

    // Reviews State
    const [reviews, setReviews] = useState([]);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState('');

    useEffect(() => {
        const fetchProperty = async () => {
            if (location.state?.property) { setProperty(location.state.property); return; }
            try {
                const res = await axios.get(`${API_BASE_URL}/api/properties/${id}`);
                setProperty(res.data);
            } catch (e) {
                console.error(e);
            }
        };

        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/reviews/property/${id}`);
                setReviews(res.data);
            } catch (e) {
                console.error("Failed to fetch reviews", e);
            }
        };

        fetchProperty();
        fetchReviews();
    }, [id, location.state]);

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/transactions/book/${id}`, null, { headers: { Authorization: `Bearer ${token}` } });
            setPayStatus('success');
        } catch (e) { setPayStatus('error'); }
    };

    if (!property) return (
        <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                <div style={{ color: '#333', fontSize: '0.875rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading</div>
            </motion.div>
        </div>
    );

    const images = property.images ? property.images.split(',').map(s => {
        let trimmed = s.trim();
        return trimmed.startsWith('http') ? trimmed : `${API_BASE_URL}/uploads/${trimmed}`;
    }) : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

    // Review logic
    const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0;
    const hasReviewed = user && reviews.some(r => r.buyerId === user.id);

    const submitReview = async () => {
        if (!reviewRating) { setReviewError('Please select a rating.'); return; }
        if (!reviewComment.trim()) { setReviewError('Please write a comment.'); return; }
        setSubmittingReview(true);
        setReviewError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/reviews/property/${id}`, { rating: reviewRating, comment: reviewComment }, { headers: { Authorization: `Bearer ${token}` } });
            setReviews([res.data, ...reviews]);
            setReviewRating(0);
            setReviewComment('');
        } catch (e) {
            setReviewError(e.response?.data || 'Failed to submit review.');
        } finally {
            setSubmittingReview(false);
        }
    };

    const specs = [
        { icon: Bed, label: 'Beds', value: property.beds, show: !!property.beds },
        { icon: Bath, label: 'Baths', value: property.baths, show: !!property.baths },
        { icon: Maximize, label: 'Sq.ft', value: property.area, show: !!property.area },
        { icon: Home, label: 'Type', value: property.type, show: !!property.type },
    ].filter(s => s.show);

    return (
        <div style={{ background: '#000', minHeight: '100vh', paddingTop: 'var(--navbar-height)', fontFamily: 'var(--font-sans)' }}>

            {/* ── Back bar ───────────────────────────────────── */}
            <div style={{ borderBottom: '1px solid #111', padding: '1rem 2.5rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#888', fontFamily: 'var(--font-sans)',
                        fontSize: '0.875rem', fontWeight: 600,
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#888'}
                >
                    <ArrowLeft size={16} /> Back to listings
                </button>
            </div>

            {/* ── Hero image ─────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ position: 'relative', height: 'clamp(300px, 50vh, 560px)', overflow: 'hidden' }}
            >
                <motion.img
                    key={activeImg}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    src={images[activeImg]}
                    alt={property.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />

                <div style={{
                    position: 'absolute', top: 16, right: 16,
                    background: property.status === 'AVAILABLE' ? 'rgba(255,255,255,0.9)' : 'rgba(255,180,0,0.9)',
                    color: property.status === 'AVAILABLE' ? '#000' : '#000',
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', padding: '4px 12px', borderRadius: 100,
                }}>
                    {property.status}
                </div>

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 2.5rem' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}
                        style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 0.25rem' }}
                    >
                        {property.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.22 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}
                    >
                        <p style={{ color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px', margin: 0, fontSize: '0.9rem' }}>
                            <MapPin size={14} /> {property.address}, {property.city}
                        </p>
                        {reviews.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 100, backdropFilter: 'blur(4px)' }}>
                                <Star size={12} color="#facc15" fill="#facc15" />
                                <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>{avgRating}</span>
                                <span style={{ color: '#aaa', fontSize: '0.75rem' }}>({reviews.length})</span>
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 2.5rem', background: '#050505', overflowX: 'auto' }}>
                    {images.map((src, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveImg(i)}
                            style={{
                                flexShrink: 0, width: 72, height: 52, borderRadius: 6, overflow: 'hidden',
                                border: i === activeImg ? '2px solid #fff' : '2px solid transparent',
                                padding: 0, cursor: 'pointer', background: 'none',
                                transition: 'border-color 0.2s',
                            }}
                        >
                            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                    ))}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '2rem', padding: '2.5rem', maxWidth: 1200, margin: '0 auto' }} className="property-details-grid">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                        style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #111' }}
                    >
                        <span style={{ color: '#fff', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.04em' }}>
                            ₹ {property.price?.toLocaleString()}
                        </span>
                        <span style={{ color: '#444', fontSize: '0.8rem' }}>total asking price</span>
                    </motion.div>

                    {specs.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.18 }}
                            style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(specs.length, 4)}, 1fr)`, gap: '0.75rem', marginBottom: '2rem' }}
                        >
                            {specs.map(({ icon: Icon, label, value }) => (
                                <div key={label} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
                                    <Icon size={18} color="#fff" style={{ marginBottom: '0.4rem' }} />
                                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{value}</div>
                                    <div style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.24 }} style={{ marginBottom: '2rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '0.875rem' }}>About this property</h2>
                        <p style={{ color: '#999', fontSize: '0.9375rem', lineHeight: 1.75, margin: 0 }}>{property.description || 'No description provided.'}</p>
                    </motion.div>

                    {property.additionalDetails && Object.keys(property.additionalDetails).length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.26 }} style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '0.875rem' }}>Property Features</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                {Object.entries(property.additionalDetails).map(([key, value]) => {
                                    if (!value) return null;
                                    const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                    return (
                                        <div key={key} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 10, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <div style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{formattedKey}</div>
                                            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{value}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
                        <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '0.875rem' }}>Location</h2>
                        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #1a1a1a', marginBottom: '2rem' }}>
                            <PropertyMap location={`${property.address}, ${property.city}`} />
                        </div>
                    </motion.div>

                    {/* Reviews Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
                    >
                        <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Reviews <span style={{ color: '#666', fontWeight: 400, fontSize: '0.9rem' }}>({reviews.length})</span>
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {reviews.length === 0 ? (
                                <p style={{ color: '#555', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>No reviews yet.</p>
                            ) : (
                                reviews.map(r => (
                                    <div key={r.id} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#111', border: '1px solid #222', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>
                                                {r.buyerProfilePicture ? <img src={r.buyerProfilePicture.startsWith('http') ? r.buyerProfilePicture : `${API_BASE_URL}/uploads/${r.buyerProfilePicture}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : r.buyerName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 600 }}>{r.buyerName}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 2 }}>
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star key={star} size={10} color={star <= r.rating ? "#facc15" : "#333"} fill={star <= r.rating ? "#facc15" : "transparent"} />
                                                    ))}
                                                    <span style={{ color: '#555', fontSize: '0.7rem', marginLeft: 4 }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{r.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {user?.role === 'BUYER' && !hasReviewed && (
                            <div style={{ background: '#050505', border: '1px solid #1a1a1a', borderRadius: 12, padding: '1.5rem' }}>
                                <h3 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Write a Review</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <span style={{ color: '#888', fontSize: '0.875rem', marginRight: '0.5rem' }}>Rating:</span>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onClick={() => setReviewRating(star)}
                                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', outline: 'none' }}
                                        >
                                            <Star size={20} color={star <= reviewRating ? "#facc15" : "#333"} fill={star <= reviewRating ? "#facc15" : "transparent"} style={{ transition: 'all 0.2s' }} />
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Share your thoughts about this property..."
                                    rows={4}
                                    style={{ width: '100%', background: '#000', border: '1px solid #2a2a2a', borderRadius: 8, padding: '0.75rem', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none', resize: 'vertical', marginBottom: '1rem', boxSizing: 'border-box' }}
                                />
                                {reviewError && <div style={{ color: '#ff6b6b', fontSize: '0.8rem', marginBottom: '1rem' }}>{reviewError}</div>}
                                <button
                                    onClick={submitReview}
                                    disabled={submittingReview}
                                    style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 8, padding: '0.75rem 1.5rem', fontWeight: 700, fontSize: '0.875rem', cursor: submittingReview ? 'not-allowed' : 'pointer', opacity: submittingReview ? 0.7 : 1 }}
                                >
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        )}
                        {user?.role === 'BUYER' && hasReviewed && (
                            <div style={{ background: '#111', border: '1px solid #222', borderRadius: 8, padding: '1rem', textAlign: 'center', color: '#888', fontSize: '0.875rem' }}>
                                You have already reviewed this property.
                            </div>
                        )}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
                    style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 1.5rem)', alignSelf: 'start' }}
                >
                    <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #111' }}>
                            <div style={{ width: 44, height: 44, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', color: '#000', flexShrink: 0 }}>
                                {property.sellerName?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9375rem' }}>{property.sellerName || 'Seller'}</div>
                                <div style={{ color: '#555', fontSize: '0.78rem' }}>{property.sellerEmail}</div>
                            </div>
                        </div>

                        {user?.role === 'BUYER' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setShowPayModal(true)}
                                    style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 10, padding: '0.875rem', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}
                                >
                                    <CreditCard size={16} /> Book Now · 5% Token
                                </motion.button>
                                {[
                                    { href: `tel:${property.sellerPhone || '9999999999'}`, icon: Phone, label: 'Call Seller' },
                                    { href: `mailto:${property.sellerEmail}`, icon: Mail, label: 'Email Enquiry' },
                                    { href: `https://wa.me/${property.sellerPhone || '919999999999'}?text=Hi, I'm interested in: ${encodeURIComponent(property.title)}`, icon: MessageCircle, label: 'WhatsApp' },
                                ].map(({ href, icon: Icon, label }) => (
                                    <motion.a
                                        key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" whileTap={{ scale: 0.97 }}
                                        style={{ background: 'transparent', color: '#ccc', border: '1px solid #2a2a2a', borderRadius: 10, padding: '0.75rem', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#ccc'; }}
                                    >
                                        <Icon size={15} /> {label}
                                    </motion.a>
                                ))}
                            </div>
                        ) : (
                            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
                                <p style={{ color: '#555', fontSize: '0.875rem', margin: 0 }}>
                                    <a href="/login" style={{ color: '#fff', fontWeight: 600 }}>Log in as a Buyer</a> to contact the seller.
                                </p>
                            </div>
                        )}
                        {contactMsg && <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 8, padding: '0.75rem', marginTop: '0.75rem', color: '#888', fontSize: '0.8rem', textAlign: 'center' }}>{contactMsg}</div>}
                    </div>
                </motion.div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .property-details-grid { grid-template-columns: 1fr !important; padding: 1.5rem !important; }
                }
                @media (max-width: 640px) {
                    .property-details-grid { padding: 1rem !important; }
                }
            `}</style>

            <AnimatePresence>
                {showPayModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => { if (!payStatus) setShowPayModal(false); }}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 1200 }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, x: '-50%', y: 'calc(-50% + 20px)' }}
                            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                            exit={{ opacity: 0, scale: 0.96, x: '-50%', y: 'calc(-50% + 20px)' }}
                            transition={{ duration: 0.3, ease: EASE }}
                            style={{ position: 'fixed', top: '50%', left: '50%', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, width: '90%', maxWidth: 440, zIndex: 1300, padding: '2rem' }}
                        >
                            {payStatus !== 'success' ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h2 style={{ color: '#fff', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>Confirm Booking</h2>
                                        <button onClick={() => setShowPayModal(false)} style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem' }}>
                                        <div style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Property</div>
                                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>{property.title}</div>
                                        <div style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Token Amount (5%)</div>
                                        <div style={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.03em' }}>₹ {Math.round(property.price * 0.05).toLocaleString()}</div>
                                    </div>
                                    <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>This is a 5% token payment to confirm your interest. The remaining amount will be settled directly with the seller.</p>
                                    {payStatus === 'error' && <div style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.25)', borderRadius: 8, padding: '0.75rem', color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1rem' }}>Payment failed. Please try again.</div>}
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button onClick={() => setShowPayModal(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #2a2a2a', color: '#666', borderRadius: 10, padding: '0.75rem', fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>Cancel</button>
                                        <button onClick={handlePayment} style={{ flex: 2, background: '#fff', color: '#000', border: 'none', borderRadius: 10, padding: '0.75rem', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>Pay ₹ {Math.round(property.price * 0.05).toLocaleString()}</button>
                                    </div>
                                </>
                            ) : (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '1rem 0' }}>
                                    <CheckCircle size={40} color="#fff" style={{ marginBottom: '1.25rem' }} />
                                    <h2 style={{ color: '#fff', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
                                    <p style={{ color: '#555', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Your token payment was successful. The seller will contact you shortly.</p>
                                    <button onClick={() => { setShowPayModal(false); setPayStatus(''); }} style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 10, padding: '0.75rem 2rem', fontFamily: 'var(--font-sans)', fontWeight: 700, cursor: 'pointer' }}>Done</button>
                                </motion.div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <motion.a
                href={`https://wa.me/${property.sellerPhone || '919999999999'}?text=Hi, I'm interested in: ${encodeURIComponent(property.title)}`}
                target="_blank" rel="noreferrer" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.4, ease: EASE }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
                style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', width: 56, height: 56, borderRadius: '50%', background: '#fff', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900, textDecoration: 'none', color: '#000', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
            >
                <MessageCircle size={24} />
            </motion.a>
        </div>
    );
};

export default PropertyDetails;
