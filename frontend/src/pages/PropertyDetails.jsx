import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Carousel, Modal, Form, Alert, Card } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Bed, Bath, Hash, CheckCircle, CreditCard, MessageCircle, Phone, Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import PropertyMap from '../components/PropertyMap';

const PropertyDetails = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [property, setProperty] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [contactStatus, setContactStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');

    useEffect(() => {
        const fetchProperty = async () => {
            // 1. Try to use passed state first
            if (location.state && location.state.property) {
                setProperty(location.state.property);
                return;
            }

            // 2. Fetch from backend if no state
            try {
                const res = await axios.get(`http://localhost:8081/api/properties/${id}`);
                setProperty(res.data);
            } catch (e) {
                console.error("Failed to fetch property, using mock data");
                setProperty({
                    id: 1,
                    title: "Luxury Villa (Mock Data)",
                    description: "This is a mock property visible because the backend is not running. Use this to verify the Hero Image, Contact Buttons, and WhatsApp integration.",
                    price: 15000000,
                    address: "123 Mock Lane",
                    city: "Mumbai",
                    type: "HOUSE",
                    status: "AVAILABLE",
                    beds: 4,
                    baths: 3,
                    area: 2500,
                    seller: { name: "Mock Seller", email: "seller@test.com", phone: "9876543210" },
                    images: "https://images.unsplash.com/photo-1600596542815-e3285e694c95?auto=format&fit=crop&w=1200&q=80"
                });
            }
        };
        fetchProperty();
    }, [id, location.state]);

    const handleContactSeller = async () => {
        if (!user) return navigate('/login');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:8081/api/contacts/${id}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContactStatus('Request Sent Successfully!');
        } catch (e) {
            setContactStatus('Failed to send request.');
        }
    };

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:8081/api/transactions/book/${id}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPaymentStatus('Payment Successful! Transaction ID generated.');
            setShowPaymentModal(false);
        } catch (e) {
            setPaymentStatus('Payment Failed.');
        }
    };

    if (!property) return <div className="text-center py-5">Loading...</div>;

    const images = property.images ? property.images.split(',') : ['https://via.placeholder.com/800x400'];

    return (
        <Container className="py-5">
            {/* Back Button */}
            <Button
                variant="link"
                onClick={() => navigate(-1)}
                className="text-decoration-none text-secondary mb-4 p-0 d-flex align-items-center gap-2 fw-bold"
            >
                <ArrowLeft size={20} /> Back to Listings
            </Button>

            <Row>
                <Col lg={8}>
                    {/* Hero Image */}
                    <div className="rounded-4 overflow-hidden shadow-sm mb-4 position-relative" style={{ height: '400px' }}>
                        <img
                            src={images[0]}
                            alt={property.title}
                            className="w-100 h-100 object-fit-cover"
                        />
                        <Badge bg={property.status === 'AVAILABLE' ? 'success' : 'warning'} className="position-absolute top-0 end-0 m-3 fs-6">
                            {property.status}
                        </Badge>
                    </div>

                    <div className="mb-5">
                        <h1 className="fw-bold mb-2">{property.title}</h1>
                        <p className="text-muted fs-5 d-flex align-items-center gap-2">
                            <MapPin size={20} /> {property.address}, {property.city}
                        </p>

                        {/* Google Map Integration */}
                        <div className="mb-4 rounded-4 overflow-hidden border shadow-sm">
                            <PropertyMap location={`${property.address}, ${property.city}`} />
                        </div>

                        <h2 className="text-primary fw-bold mb-4">₹ {property.price.toLocaleString()}</h2>

                        <h4 className="fw-bold mb-3">Description</h4>
                        <p className="text-secondary leading-relaxed mb-4">
                            {property.description}
                        </p>

                        <h4 className="fw-bold mb-3">Details & Amenities</h4>
                        <Row xs={2} md={4} className="g-3 mb-4">
                            {property.type === 'HOUSE' && (
                                <>
                                    <Col>
                                        <div className="p-3 border rounded-3 text-center bg-light">
                                            <Bed size={24} className="mb-2 text-primary" />
                                            <div className="fw-bold">{property.beds} Beds</div>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="p-3 border rounded-3 text-center bg-light">
                                            <Bath size={24} className="mb-2 text-primary" />
                                            <div className="fw-bold">{property.baths} Baths</div>
                                        </div>
                                    </Col>
                                </>
                            )}
                            <Col>
                                <div className="p-3 border rounded-3 text-center bg-light">
                                    <Hash size={24} className="mb-2 text-primary" />
                                    <div className="fw-bold">{property.area} sqft</div>
                                </div>
                            </Col>
                            <Col>
                                <div className="p-3 border rounded-3 text-center bg-light">
                                    <CheckCircle size={24} className="mb-2 text-primary" />
                                    <div className="fw-bold">{property.type}</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>

                <Col lg={4}>
                    <Card className="shadow-sm border-0 sticky-top" style={{ top: '100px' }}>
                        <Card.Body className="p-4">
                            <h4 className="fw-bold mb-4">Contact Seller</h4>

                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                    {property.seller.name.charAt(0)}
                                </div>
                                <div>
                                    <h5 className="mb-0 fw-bold">{property.seller.name}</h5>
                                    <small className="text-muted">{property.seller.email}</small>
                                </div>
                            </div>

                            {user?.role === 'BUYER' ? (
                                <div className="d-grid gap-3">
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button variant="success" size="lg" className="w-100 rounded-pill shadow-sm text-white" onClick={() => setShowPaymentModal(true)}>
                                            <CreditCard size={20} className="me-2" /> Book Now (5% Token)
                                        </Button>
                                    </motion.div>

                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button href={`tel:${property.seller.phone || '9999999999'}`} variant="outline-primary" size="lg" className="w-100 d-flex align-items-center justify-content-center gap-2">
                                            <Phone size={20} /> Call Seller
                                        </Button>
                                    </motion.div>

                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button href={`mailto:${property.seller.email}`} variant="outline-primary" size="lg" className="w-100 d-flex align-items-center justify-content-center gap-2">
                                            <Mail size={20} /> Email Enquiry
                                        </Button>
                                    </motion.div>

                                    <Button
                                        href={`https://wa.me/${property.seller.phone || '919999999999'}?text=Hi, I'm interested in your property: ${property.title}`}
                                        target="_blank"
                                        variant="success"
                                        size="lg"
                                        className="w-100 d-flex align-items-center justify-content-center gap-2 text-white"
                                    >
                                        <MessageCircle size={20} /> Chat on WhatsApp
                                    </Button>

                                    <hr className="my-2" />
                                </div>
                            ) : (
                                <Alert variant="info">Login as Buyer to view contact details.</Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Payment Modal */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Secure Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <h4 className="mb-4">Pay ₹ {property.price.toLocaleString()}</h4>
                    <p className="text-muted">Simulating payment gateway...</p>
                    {paymentStatus && <Alert variant="success">{paymentStatus}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handlePayment} disabled={!!paymentStatus}>Confirm Payment</Button>
                </Modal.Footer>
            </Modal>

            {/* Floating WhatsApp Button */}
            <motion.a
                href={`https://wa.me/${property.seller.phone || '919999999999'}?text=Hi, I'm interested in: ${property.title}`}
                target="_blank"
                className="position-fixed bottom-0 end-0 m-4 d-flex align-items-center justify-content-center bg-success text-white shadow-lg rounded-circle text-decoration-none"
                style={{ width: '60px', height: '60px', zIndex: 1000 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <MessageCircle size={32} />
            </motion.a>
        </Container>
    );
};

export default PropertyDetails;
