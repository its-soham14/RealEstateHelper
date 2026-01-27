import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface PropertyCardProps {
    property: any;
    user?: any;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, user }) => {
    const navigate = useNavigate();
    const { id, title, type, price, address, city, area, beds, baths, images } = property;
    const imageUrl = images ? images.split(',')[0] : 'https://via.placeholder.com/400x300';
    const [isLiked, setIsLiked] = useState(false);

    // Dynamic styles based on type (simulating the example provided)
    const getBadgeStyle = (type: string) => {
        switch (type) {
            case 'FARM': case 'LAND':
                return { bg: '#DCFCE7', color: '#22C55E', label: type === 'FARM' ? 'Farmland' : 'Land' };
            case 'COMMERCIAL':
                return { bg: '#FEF3C7', color: '#F59E0B', label: 'Commercial' };
            default: // HOUSE, APARTMENT, VILLA
                return { bg: '#FFE5E0', color: '#FF6B5B', label: type };
        }
    };

    const badgeStyle = getBadgeStyle(type);

    useEffect(() => {
        if (user && user.role === 'BUYER') {
            checkLikeStatus();
        }
    }, [user, id]);

    const checkLikeStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const res = await axios.get(`http://localhost:8081/api/likes/${id}/check`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsLiked(res.data);
            }
        } catch (e) { console.error(e); }
    };

    const toggleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user || user.role !== 'BUYER') {
            // Using alert for simplicity, could be toast or modal
            alert("Please login as a Buyer to like properties.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:8081/api/likes/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsLiked(res.data);
        } catch (e) {
            console.error("Error toggling like", e);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -15, rotateZ: 2 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => navigate(`/property/${id}`, { state: { property } })}
            style={{ cursor: 'pointer', height: '100%' }}
        >
            <Card className="border-0 h-100 rounded-4 overflow-hidden" style={{
                boxShadow: '0 15px 40px rgba(0, 102, 255, 0.15)',
                background: 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <Card.Img
                            variant="top"
                            src={imageUrl}
                            height={280}
                            style={{ objectFit: 'cover' }}
                        />
                    </motion.div>

                    {/* Badge */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            backgroundColor: badgeStyle.bg,
                            color: badgeStyle.color,
                            padding: '6px 16px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            letterSpacing: '0.5px',
                            textTransform: 'capitalize'
                        }}
                    >
                        {badgeStyle.label}
                    </div>

                    {/* Like Button (Heart) - Kept overlapping image like original but styled cleaner */}
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <Button
                            variant="light"
                            className={`rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center border-0 ${isLiked ? 'text-danger' : 'text-secondary'}`}
                            style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.9)' }}
                            onClick={toggleLike}
                        >
                            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                        </Button>
                    </div>
                </div>

                <Card.Body className="p-4 d-flex flex-column justify-content-between">
                    <div>
                        <h5 className="fw-bold mb-2 text-dark" style={{ fontSize: '1.3rem' }}>
                            {title}
                        </h5>
                        <p className="text-muted small mb-3" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={16} /> {city}, {address}
                        </p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                        <span className="fw-bold" style={{
                            fontSize: '1.25rem',
                            background: `linear-gradient(135deg, ${badgeStyle.color} 0%, #0099ff 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            ₹ {price ? price.toLocaleString() : 'N/A'}
                        </span>

                        <Button
                            variant="light"
                            size="sm"
                            className="rounded-circle p-2"
                            style={{
                                backgroundColor: badgeStyle.bg,
                                color: badgeStyle.color,
                                border: 'none',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <ArrowRight size={20} />
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </motion.div>
    );
};

export default PropertyCard;
