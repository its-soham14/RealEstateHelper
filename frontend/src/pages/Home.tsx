import React from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ShieldCheck, MapPin, Zap, Users, Star } from 'lucide-react';

interface HomeProps {
    user?: any;
}

// Animation Variants
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const Home: React.FC<HomeProps> = ({ user }) => {
    return (
        <div style={{ backgroundColor: '#fff' }}>
            {/* Hero Section */}
            <section className="position-relative d-flex align-items-center" 
                style={{ 
                    minHeight: '90vh', 
                    overflow: 'hidden',
                    background: 'radial-gradient(circle at 90% 10%, rgba(0, 102, 255, 0.05) 0%, rgba(255, 255, 255, 1) 50%)' 
                }}>
                {/* Decorative background element */}
                <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25" style={{ zIndex: 0, pointerEvents: 'none' }}>
                    <div className="position-absolute" style={{ top: '10%', left: '5%', width: '300px', height: '300px', background: '#0066ff', filter: 'blur(150px)', borderRadius: '50%' }}></div>
                </div>

                <Container className="position-relative" style={{ zIndex: 1 }}>
                    <Row className="align-items-center">
                        <Col lg={6} className="text-start">
                            <motion.div initial="initial" animate="animate" variants={fadeInUp}>
                                <Badge bg="primary-subtle" className="text-primary px-3 py-2 rounded-pill mb-3 fw-bold">
                                    <Star size={14} className="me-1 mb-1" /> The #1 Real Estate Marketplace
                                </Badge>
                                <h1 className="display-3 fw-extrabold text-dark mb-4" style={{ letterSpacing: '-2px', lineHeight: 1.1 }}>
                                    Your Vision. Our <span className="text-primary" style={{ position: 'relative' }}>
                                        Expertise.
                                        <svg className="position-absolute start-0 w-100" style={{ bottom: '-10px' }} viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 15 Q50 5 100 15 T200 15" fill="none" stroke="#0066ff" strokeWidth="4" />
                                        </svg>
                                    </span><br />
                                    The Perfect Home.
                                </h1>
                                <p className="lead text-muted mb-5 fs-5 w-75">
                                    Discover verified premium listings. From urban luxury apartments to serene country farmsteads, we connect you to your future.
                                </p>
                                <div className="d-flex gap-3 align-items-center">
                                    <Button as={Link as any} to="/signup" variant="primary" size="lg" className="rounded-pill px-5 py-3 shadow-primary hover-lift border-0" style={{ backgroundColor: '#0066ff' }}>
                                        Explore Now <ArrowRight className="ms-2" size={20} />
                                    </Button>
                                    <div className="d-flex align-items-center ms-3">
                                        <div className="d-flex me-2">
                                            {[1,2,3].map(i => (
                                                <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="rounded-circle border border-white" style={{ width: '40px', height: '40px', marginLeft: i > 1 ? '-15px' : '0' }} alt="user" />
                                            ))}
                                        </div>
                                        <small className="text-muted fw-bold">10k+ Happy Users</small>
                                    </div>
                                </div>
                            </motion.div>
                        </Col>
                        
                        <Col lg={6} className="position-relative mt-5 mt-lg-0">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                transition={{ duration: 1 }}
                                className="ps-lg-5"
                            >
                                <div className="position-relative">
                                    <div className="rounded-5 shadow-2xl overflow-hidden position-relative" style={{ border: '8px solid white' }}>
                                        <img
                                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000"
                                            alt="Modern Living"
                                            className="img-fluid"
                                        />
                                    </div>
                                    {/* Floating stats card */}
                                    <motion.div 
                                        animate={{ y: [0, -10, 0] }} 
                                        transition={{ repeat: Infinity, duration: 4 }}
                                        className="position-absolute bg-white p-3 rounded-4 shadow-lg d-flex align-items-center"
                                        style={{ bottom: '10%', left: '-5%', zIndex: 2 }}
                                    >
                                        <div className="bg-success-subtle p-2 rounded-3 me-3"><CheckCircle className="text-success" /></div>
                                        <div>
                                            <div className="fw-bold mb-0">Verified</div>
                                            <small className="text-muted">Govt. Approved</small>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Trust Stats Bar */}
            <Container className="my-5 mt-n5 position-relative" style={{ zIndex: 10 }}>
                <Card className="border-0 shadow-lg rounded-5 py-4 px-2" style={{ marginTop: '-60px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}>
                    <Row className="text-center align-items-center">
                        <Col md={3} className="border-end border-light">
                            <h2 className="fw-bold text-primary mb-0">$2.5B+</h2>
                            <small className="text-muted text-uppercase fw-bold">Property Value</small>
                        </Col>
                        <Col md={3} className="border-end border-light">
                            <h2 className="fw-bold text-primary mb-0">24k+</h2>
                            <small className="text-muted text-uppercase fw-bold">Properties Sold</small>
                        </Col>
                        <Col md={3} className="border-end border-light">
                            <h2 className="fw-bold text-primary mb-0">99%</h2>
                            <small className="text-muted text-uppercase fw-bold">Client Support</small>
                        </Col>
                        <Col md={3}>
                            <h2 className="fw-bold text-primary mb-0">15+</h2>
                            <small className="text-muted text-uppercase fw-bold">Years Experience</small>
                        </Col>
                    </Row>
                </Card>
            </Container>

            {/* Featured Listings Section */}
            <section className="py-5">
                <Container>
                    <div className="d-flex justify-content-between align-items-end mb-5">
                        <div>
                            <h6 className="text-primary fw-bold text-uppercase mb-2" style={{ letterSpacing: '2px' }}>Recommendations</h6>
                            <h2 className="display-6 fw-bold text-dark">Featured Collections</h2>
                        </div>
                        <Button variant="link" className="text-primary text-decoration-none fw-bold">View All Listings <ArrowRight size={18} /></Button>
                    </div>

                    <Row>
                        {[
                            {
                                type: 'Modern Villa',
                                location: 'Mumbai, India',
                                price: '₹ 2.5 Cr',
                                image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                                badge: 'House',
                                color: '#0066ff'
                            },
                            {
                                type: 'Agricultural Farmland',
                                location: 'Pune, India',
                                price: '₹ 85 L',
                                image: 'https://images.pexels.com/photos/6216870/pexels-photo-6216870.jpeg?auto=format&fit=crop&w=400&q=80',
                                badge: 'Farmland',
                                color: '#22C55E'
                            },
                            {
                                type: 'Residential Land',
                                location: 'Bangalore, India',
                                price: '₹ 1.2 Cr',
                                image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
                                badge: 'Land',
                                color: '#F59E0B'
                            }
                        ].map((property, index) => (
                            <Col md={4} key={index} className="mb-4">
                                <motion.div whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
                                    <Card className="border-0 h-100 rounded-5 overflow-hidden shadow-hover" style={{ backgroundColor: '#fff' }}>
                                        <div className="position-relative">
                                            <Card.Img variant="top" src={property.image} style={{ height: '280px', objectFit: 'cover' }} />
                                            <Badge className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm" style={{ backgroundColor: property.color }}>
                                                {property.badge}
                                            </Badge>
                                            <div className="position-absolute bottom-0 end-0 m-3 bg-white px-3 py-1 rounded-pill fw-bold text-dark shadow-sm">
                                                {property.price}
                                            </div>
                                        </div>
                                        <Card.Body className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="fw-bold mb-0">{property.type}</h5>
                                                <div className="text-warning"><Star size={16} fill="currentColor" /> 4.8</div>
                                            </div>
                                            <p className="text-muted d-flex align-items-center gap-1 mb-4">
                                                <MapPin size={14} /> {property.location}
                                            </p>
                                            <Button variant="outline-primary" className="w-100 rounded-pill py-2 fw-bold">View Details</Button>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-5 bg-light rounded-top-5">
                <Container className="py-5">
                    <Row className="mb-5 justify-content-center text-center">
                        <Col lg={6}>
                            <h2 className="fw-bold mb-3 display-6">Unmatched Excellence</h2>
                            <p className="text-muted">We provide a premium ecosystem for real estate transactions, ensuring security and ease at every step.</p>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        {[
                            { icon: <MapPin className="text-primary" />, title: "Smart Search", text: "Advanced filtering to pinpoint your exact needs effortlessly." },
                            { icon: <ShieldCheck className="text-success" />, title: "Verified Listings", text: "Every property undergoes a rigorous document verification process." },
                            { icon: <Users className="text-info" />, title: "Direct Connect", text: "Zero middlemen. Direct communication between buyers and sellers." },
                            { icon: <Zap className="text-warning" />, title: "Fast Closing", text: "Digital workflows that slash transaction times by up to 40%." },
                        ].map((item, index) => (
                            <Col md={6} lg={3} key={index}>
                                <motion.div whileHover={{ scale: 1.05 }} className="h-100">
                                    <Card className="border-0 shadow-sm h-100 rounded-5 p-4 text-center glass-effect">
                                        <div className="mx-auto mb-4 bg-white shadow-sm d-flex align-items-center justify-content-center rounded-circle" style={{ width: 80, height: 80 }}>
                                            {item.icon}
                                        </div>
                                        <h5 className="fw-bold mb-3">{item.title}</h5>
                                        <p className="text-muted mb-0 small px-2">{item.text}</p>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Final CTA Section */}
            <section className="py-5">
                <Container>
                    <div className="rounded-5 p-5 text-white text-center shadow-lg position-relative overflow-hidden" 
                        style={{ backgroundColor: '#0066ff', background: 'linear-gradient(45deg, #0052cc 0%, #0066ff 100%)' }}>
                        <div className="position-relative z-1">
                            <h2 className="display-5 fw-bold mb-4">Ready to find your next home?</h2>
                            <p className="lead mb-5 opacity-75">Join thousands of people finding their dream property every day.</p>
                            <Button as={Link as any} to="/signup" variant="light" size="lg" className="rounded-pill px-5 py-3 fw-bold text-primary shadow">
                                Create Free Account Today
                            </Button>
                        </div>
                        {/* Abstract circle decoration */}
                        <div className="position-absolute top-0 end-0 p-5 opacity-25" style={{ transform: 'translate(30%, -30%)' }}>
                            <div className="rounded-circle border border-white" style={{ width: '400px', height: '400px' }}></div>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default Home;