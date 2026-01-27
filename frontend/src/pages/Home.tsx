import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Home as HomeIcon } from 'lucide-react';

interface HomeProps {
    user?: any;
}

const Home: React.FC<HomeProps> = ({ user }) => {
    return (
        <div>
            {/* Hero Section */}
            <section className="position-relative d-flex align-items-center bg-light" style={{ minHeight: '80vh', overflow: 'hidden' }}>
                <Container className="position-relative z-1">
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 className="display-4 fw-bold text-dark mb-4">
                                    Find Your Dream <span className="text-primary">Property</span> With Ease
                                </h1>
                                <p className="lead text-muted mb-5">
                                    Discover the perfect home, land, or farm from our verified listings.
                                    Seamlessly connect with sellers and manage your real estate journey.
                                </p>
                                <div className="d-flex gap-3">
                                    <Button as={Link as any} to="/signup" variant="primary" size="lg" className="rounded-pill px-5 py-3 shadow-lg">
                                        Get Started <ArrowRight className="ms-2" size={20} />
                                    </Button>
                                    <Button as={Link as any} to="/login" variant="outline-dark" size="lg" className="rounded-pill px-5 py-3">
                                        Login
                                    </Button>
                                </div>
                            </motion.div>
                        </Col>
                        <Col lg={6} className="text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="rounded-5 shadow-lg bg-white p-3 d-inline-block">
                                    <img
                                        src="https://aslgate.com/wp-content/uploads/2022/03/9606.jpg_wh860.jpg"
                                        alt="Modern Building"
                                        className="rounded-4 img-fluid"
                                        style={{ maxHeight: '500px' }}
                                    />
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

{/* Featured Listings Preview */}
            <section className="py-5" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)' }}>
                <Container>
                    <div className="text-center mb-5">
                        <motion.h2 
                            className="fw-bold" 
                            style={{ fontSize: '2.5rem', background: 'linear-gradient(135deg, #0066ff 0%, #0099ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Featured Properties
                        </motion.h2>
                        <p className="text-muted">Explore top trending verified listings</p>
                    </div>
                    <Row>
                        {[
                            {
                                type: 'Modern Villa',
                                location: 'Mumbai, India',
                                price: '₹ 2.5 Cr',
                                image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                                badge: 'House',
                                badgeColor: '#FF6B5B',
                                badgeBg: '#FFE5E0'
                            },
                            {
                                type: 'Agricultural Farmland',
                                location: 'Pune, India',
                                price: '₹ 85 L',
                                image: 'https://images.pexels.com/photos/6216870/pexels-photo-6216870.jpeg?_gl=1*1v4si8g*_ga*ODQ2NTQwNjE0LjE3Njk0MTMyNzI.*_ga_8JE65Q40S6*czE3Njk0MTMyNzIkbzEkZzAkdDE3Njk0MTMyNzIkajYwJGwwJGgw',
                                badge: 'Farmland',
                                badgeColor: '#22C55E',
                                badgeBg: '#DCFCE7'
                            },
                            {
                                type: 'Residential Land',
                                location: 'Bangalore, India',
                                price: '₹ 1.2 Cr',
                                image: 'https://www.aakruthiproperties.com/wp-content/uploads/2025/08/Difference-Between-Land-and-Plot-in-Real-Estate.png',
                                badge: 'Land',
                                badgeColor: '#F59E0B',
                                badgeBg: '#FEF3C7'
                            }
                        ].map((property, index) => (
                            <Col md={4} key={index} className="mb-4">
                                <motion.div
                                    whileHover={{ y: -15, rotateZ: 2 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
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
                                                    src={property.image} 
                                                    height={280} 
                                                    style={{ objectFit: 'cover', cursor: 'pointer' }} 
                                                />
                                            </motion.div>
                                            <div 
                                                style={{
                                                    position: 'absolute',
                                                    top: '12px',
                                                    left: '12px',
                                                    backgroundColor: property.badgeBg,
                                                    color: property.badgeColor,
                                                    padding: '6px 16px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    letterSpacing: '0.5px'
                                                }}
                                            >
                                                {property.badge}
                                            </div>
                                        </div>
                                        <Card.Body className="p-4">
                                            <h5 className="fw-bold mb-2" style={{ fontSize: '1.3rem', color: '#1a1a1a' }}>
                                                {property.type}
                                            </h5>
                                            <p className="text-muted small mb-4" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                📍 {property.location}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                                                <span className="fw-bold" style={{ fontSize: '1.1rem', background: `linear-gradient(135deg, ${property.badgeColor} 0%, #0099ff 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                                    {property.price}
                                                </span>
                                                <Button 
                                                    variant="light" 
                                                    size="sm" 
                                                    className="rounded-circle p-2" 
                                                    style={{
                                                        backgroundColor: property.badgeBg,
                                                        color: property.badgeColor,
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.15) rotate(45deg)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                                                    }}
                                                >
                                                    <ArrowRight size={18} />
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Features Section */}
<section className="py-5 bg-light">
    <Container>
        <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose RealEstateHelper?</h2>
        </div>

        <Row className="g-4">
            {[
                {
                    icon: "🏠",
                    title: "Easy Property Search",
                    text: "Find properties by location, type, and price range",
                },
                {
                    icon: "✔️",
                    title: "Verified Listings",
                    text: "All listings are verified and authentic",
                },
                {
                    icon: "👥",
                    title: "Direct Contact",
                    text: "Connect directly with buyers to sellers & sellers to buyers",
                },
                {
                    icon: "🔒",
                    title: "Secure Platform",
                    text: "Your data is safe and secure with us",
                },
            ].map((item, index) => (
                <Col md={6} lg={3} key={index}>
                    <motion.div
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="h-100"
                    >
                        <Card className="border-0 shadow-sm h-100 text-center rounded-4 p-3">
                            <div
                                className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-light"
                                style={{ width: 70, height: 70, fontSize: 30 }}
                            >
                                {item.icon}
                            </div>
                            <Card.Body>
                                <h5 className="fw-bold">{item.title}</h5>
                                <p className="text-muted small">{item.text}</p>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
            ))}
        </Row>
    </Container>
</section>


        </div>
    );
};

export default Home;
