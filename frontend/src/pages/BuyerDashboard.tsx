import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge, Tabs, Tab, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import type { User } from '../App';
import PropertyCard from '../components/PropertyCard';
import PriceRangeSlider from '../components/PriceRangeSlider';
import { Filter, Search, MapPin, Home, Heart, Calendar, RotateCcw } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

interface BuyerDashboardProps {
    user: User;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ user }) => {
    const [properties, setProperties] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [bookings, setBookings] = useState([]);
    const { searchQuery, setSearchQuery } = useSearch();
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        type: '',
        beds: ''
    });

    // ... (logic for fetchProperties, fetchWishlist, fetchBookings remains the same)
    const fetchProperties = async () => {
        try {
            const params: any = {};
            if (searchQuery) params.city = searchQuery;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.type) params.type = filters.type;
            if (filters.beds) params.beds = filters.beds;
            const res = await axios.get('http://localhost:8081/api/properties', { params });
            setProperties(res.data);
        } catch (e) {
            console.error(e);
            setProperties([]);
        }
    };

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.get('http://localhost:8081/api/likes/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/api/transactions/buyer', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchProperties();
        fetchWishlist();
        fetchBookings();
    }, [filters, searchQuery]);

    const handleFilterChange = (e: any) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <Container fluid className="px-lg-5 py-4 bg-light" style={{ minHeight: '100vh' }}>
            <Row className="g-4">
                {/* --- Sidebar Filters --- */}
                <Col lg={4} className="d-none d-lg-block">
                    <div className="sticky-top" style={{ top: '2rem' }}>
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center gap-2 mb-4 text-primary">
                                    <Filter size={22} />
                                    <h5 className="mb-0 fw-bold text-dark">Refine Search</h5>
                                </div>

                                <Form>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-bold text-uppercase text-muted mb-2">Property Type</Form.Label>
                                        <Form.Select
                                            name="type"
                                            onChange={handleFilterChange}
                                            value={filters.type}
                                            className="form-control-lg border-light bg-light rounded-3 fs-6"
                                        >
                                            <option value="">All Types</option>
                                            <option value="APARTMENT">Apartment</option>
                                            <option value="HOUSE">House</option>
                                            <option value="VILLA">Villa</option>
                                            <option value="LAND">Land</option>
                                        </Form.Select>
                                    </Form.Group>



                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-bold text-uppercase text-muted mb-3">Price Range (₹)</Form.Label>
                                        <div className="px-2">
                                            <PriceRangeSlider
                                                min={0}
                                                max={50000000}
                                                onChange={(min, max) => {
                                                    setFilters(prev => ({ ...prev, minPrice: min.toString(), maxPrice: max.toString() }));
                                                }}
                                            />
                                        </div>
                                    </Form.Group>

                                    {filters.type === 'HOUSE' && (
                                        <Form.Group className="mb-4">
                                            <Form.Label className="small fw-bold text-uppercase text-muted mb-2">Min Bedrooms</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="beds"
                                                placeholder="e.g. 2"
                                                onChange={handleFilterChange}
                                                className="form-control-lg border-light bg-light"
                                            />
                                        </Form.Group>
                                    )}

                                    <Button
                                        variant="outline-secondary"
                                        className="w-100 border-0 bg-light-subtle fw-semibold py-2 d-flex align-items-center justify-content-center gap-2 hover-shadow"
                                        onClick={() => {
                                            setFilters({ minPrice: '', maxPrice: '', type: '', beds: '' });
                                            setSearchQuery('');
                                        }}
                                    >
                                        <RotateCcw size={16} /> Reset All
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>

                {/* --- Main Content --- */}
                <Col lg={8}>
                    {/* Header Section */}
                    <div className="mb-5">
                        <h2 className="display-6 fw-bold text-dark mb-2">Welcome back, {user.name}!</h2>
                        <p className="text-muted lead">Find your next home in a few clicks.</p>

                    </div>

                    <Tabs
                        defaultActiveKey="search"
                        id="dashboard-tabs"
                        className="mb-4 custom-tabs border-0"
                        onSelect={() => { fetchProperties(); fetchWishlist(); }}
                    >
                        <Tab eventKey="search" title={<span><Home size={18} className="me-2" /> Browse</span>}>
                            <Row className="g-4">
                                {properties.map((property: any) => (
                                    <Col md={6} key={property.id}>
                                        <div className="h-100 transform-hover">
                                            <PropertyCard property={property} user={user} />
                                        </div>
                                    </Col>
                                ))}
                                {properties.length === 0 && (
                                    <div className="text-center py-5">
                                        <img src="https://illustrations.popsy.co/gray/home-office.svg" alt="empty" style={{ width: '200px' }} className="mb-3 opacity-50" />
                                        <h4 className="text-muted">No properties found.</h4>
                                        <p>Try adjusting your filters or location.</p>
                                    </div>
                                )}
                            </Row>
                        </Tab>

                        <Tab eventKey="wishlist" title={<span><Heart size={18} className="me-2" /> Wishlist</span>}>
                            <Row className="g-4">
                                {wishlist.map((property: any) => (
                                    <Col md={6} key={property.id}>
                                        <PropertyCard property={property} user={user} />
                                    </Col>
                                ))}
                                {wishlist.length === 0 && (
                                    <div className="text-center py-5">
                                        <p className="text-muted lead">You haven't saved any properties yet.</p>
                                    </div>
                                )}
                            </Row>
                        </Tab>

                        <Tab eventKey="bookings" title={<span><Calendar size={18} className="me-2" /> My Bookings</span>}>
                            <Row className="g-3">
                                {bookings.length === 0 ? (
                                    <div className="text-center py-5 w-100">
                                        <p className="text-muted">No transactions found.</p>
                                    </div>
                                ) : bookings.map((b: any) => (
                                    <Col xs={12} key={b.id}>
                                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                                            <Card.Body className="p-4 d-md-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center gap-4">
                                                    <div className="bg-primary-subtle p-3 rounded-4 d-none d-md-block">
                                                        <Home className="text-primary" />
                                                    </div>
                                                    <div>
                                                        <h5 className="fw-bold mb-1 text-dark">{b.property.title}</h5>
                                                        <div className="d-flex gap-3 small text-muted">

                                                            <span>{new Date(b.paymentDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-md-end mt-3 mt-md-0 pt-3 pt-md-0 border-top border-md-0">
                                                    <h3 className="text-primary fw-bold mb-1">₹ {b.amount.toLocaleString()}</h3>
                                                    <Badge pill bg="success-subtle" className="text-success border border-success px-3 py-2">
                                                        Payment Confirmed (5%)
                                                    </Badge>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>

            {/* Custom Styles for Tabs and Hover */}
            <style>{`
                .custom-tabs .nav-link {
                    color: #6c757d;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                .custom-tabs .nav-link.active {
                    background-color: #0d6efd !important;
                    color: white !important;
                    box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
                }
                .transform-hover {
                    transition: transform 0.3s ease;
                }
                .transform-hover:hover {
                    transform: translateY(-8px);
                }
                .bg-primary-subtle { background-color: rgba(13, 110, 253, 0.1); }
                .bg-success-subtle { background-color: rgba(25, 135, 84, 0.1); }
            `}</style>
        </Container>
    );
};

export default BuyerDashboard;