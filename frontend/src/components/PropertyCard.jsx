import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, ArrowUpRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const PropertyCard = ({ property, user, onLikeToggle }) => {
    const navigate = useNavigate();
    const { id, title, type, price, address, city, area, beds, baths, images, avgRating, reviewCount } = property;
    let firstImage = images ? images.split(',')[0].trim() : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
    if (!firstImage.startsWith('http')) {
        firstImage = `${API_BASE_URL}/uploads/${firstImage}`;
    }
    const imageUrl = firstImage.replace('/upload/', '/upload/q_auto,f_auto/');
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (user && user.role === 'BUYER') checkLikeStatus();
    }, [user, id]);

    const checkLikeStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const res = await axios.get(`${API_BASE_URL}/api/likes/${id}/check`, { headers: { Authorization: `Bearer ${token}` } });
                setIsLiked(res.data);
            }
        } catch (e) { console.error(e); }
    };

    const toggleLike = async (e) => {
        e.stopPropagation();
        if (!user || user.role !== 'BUYER') { alert('Please login as a Buyer to save properties.'); return; }
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/likes/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setIsLiked(res.data);
            if (onLikeToggle) {
                onLikeToggle();
            }
        } catch (e) { console.error('Error toggling like', e); }
    };

    return (
        <div
            onClick={() => navigate(`/property/${id}`, { state: { property } })}
            style={{
                cursor: 'pointer',
                background: '#0a0a0a',
                border: '1px solid #1a1a1a',
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
                // NO transform/scale hover — intentionally flat
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#333'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}
        >
            {/* Image */}
            <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                <img
                    src={imageUrl}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                {/* Type badge */}
                <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(6px)',
                    color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: 100,
                    border: '1px solid rgba(255,255,255,0.15)',
                }}>
                    {type}
                </div>
                {/* Heart */}
                <button
                    onClick={toggleLike}
                    style={{
                        position: 'absolute', top: 10, right: 10,
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: isLiked ? '#ff4d4d' : '#888',
                        transition: 'color 0.2s',
                    }}
                >
                    <Heart size={15} fill={isLiked ? '#ff4d4d' : 'none'} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: '1rem 1.125rem' }}>
                {/* Title — bright white, clearly readable */}
                <h3 style={{
                    color: '#fff',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    margin: '0 0 0.35rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {title}
                </h3>

                {/* Rating if available */}
                {reviewCount > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.4rem' }}>
                        <Star size={12} color="#facc15" fill="#facc15" />
                        <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>{avgRating}</span>
                        <span style={{ color: '#aaa', fontSize: '0.75rem' }}>({reviewCount})</span>
                    </div>
                )}

                {/* Location — clearly readable muted */}
                <p style={{
                    color: '#888',
                    fontSize: '0.8rem',
                    margin: '0 0 0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    <MapPin size={12} color="#555" />
                    {city}{address ? `, ${address}` : ''}
                </p>

                {/* Specs row */}
                {(beds || baths || area) && (
                    <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '0.875rem' }}>
                        {beds && <span style={{ color: '#666', fontSize: '0.78rem' }}>{beds} Beds</span>}
                        {baths && <span style={{ color: '#666', fontSize: '0.78rem' }}>{baths} Baths</span>}
                        {area && <span style={{ color: '#666', fontSize: '0.78rem' }}>{area} sqft</span>}
                    </div>
                )}

                {/* Price + Arrow row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #111', paddingTop: '0.875rem' }}>
                    <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                        ₹ {price ? price.toLocaleString() : 'N/A'}
                    </span>
                    <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        border: '1px solid #2a2a2a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#666',
                    }}>
                        <ArrowUpRight size={14} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
