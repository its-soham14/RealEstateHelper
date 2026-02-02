import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Table, Button, Modal, Form, Row, Col, Alert, Badge, Card } from 'react-bootstrap';
import axios from 'axios';
import type { User } from '../App';
import { Plus, Trash, MessageCircle, Mail, Phone, Heart } from 'lucide-react';
import PropertyMap from '../components/PropertyMap';

interface SellerDashboardProps {
    user: User;
}

interface PropertyFormState {

    id?: number;
    title?: string;
    type: string;
    price: string | number;
    address: string;
    city: string;
    area: string;
    beds: string | number;
    baths: string | number;
    bhk: string;
    description: string;
    images: string;
    status?: string;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState('listings');
    const [myProperties, setMyProperties] = useState([]);
    const [leads, setLeads] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProperty, setNewProperty] = useState<PropertyFormState>({
        type: 'HOUSE',
        price: '',
        address: '',
        city: '',
        area: '',
        beds: '',
        baths: '',
        bhk: '',
        description: '',
        images: '',
        title: ''
    });
    const [notification, setNotification] = useState<{ msg: string, type: string } | null>(null);

    const fetchMyProperties = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/api/properties/my-listings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyProperties(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/api/likes/seller-dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeads(res.data);
        } catch (e) {
            console.error(e);
            setLeads([]);
        }
    };

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/api/transactions/seller', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(res.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (activeTab === 'listings') fetchMyProperties();
        if (activeTab === 'leads') fetchLeads();
        if (activeTab === 'sold') fetchTransactions();
    }, [activeTab]);

    const handleAddProperty = async () => {
        // Validation
        if (!newProperty.title || !newProperty.address || !newProperty.city) {
            setNotification({ msg: 'Title, Address and City are required.', type: 'danger' });
            return;
        }
        if (Number(newProperty.price) <= 0 || Number(newProperty.area) <= 0) {
            setNotification({ msg: 'Price and Area must be positive numbers.', type: 'danger' });
            return;
        }
        if (newProperty.type === 'HOUSE' && (Number(newProperty.beds) < 0 || Number(newProperty.baths) < 0)) {
            setNotification({ msg: 'Beds and Baths cannot be negative.', type: 'danger' });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (newProperty.id) {
                // UPDATE Application
                await axios.put(`http://localhost:8081/api/properties/${newProperty.id}`, newProperty, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotification({ msg: 'Property updated successfully! It is pending re-approval.', type: 'info' });
            } else {
                // CREATE Application
                await axios.post('http://localhost:8081/api/properties', newProperty, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotification({ msg: 'Property submitted for approval!', type: 'success' });
            }
            setShowAddModal(false);
            fetchMyProperties();
        } catch (e: any) {
            console.error("Error saving property:", e);
            const errMsg = e.response?.data?.message || 'Failed to save property';
            setNotification({ msg: `Error: ${errMsg}`, type: 'danger' });
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8081/api/properties/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMyProperties();
        } catch (e) { console.error(e); }
    };

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1">Seller Dashboard</h2>
                    <p className="text-muted">Manage your listings and view potential leads</p>
                </div>
                <Button variant="primary" onClick={() => {
                    setNewProperty({
                        type: 'HOUSE', price: '', address: '', city: '', area: '', beds: '', baths: '', bhk: '', description: '', images: '', title: ''
                    });
                    setShowAddModal(true);
                }} className="d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm">
                    <Plus size={18} /> Add New Property
                </Button>
            </div>

            {notification && <Alert variant={notification.type} onClose={() => setNotification(null)} dismissible className="rounded-3 shadow-sm mb-4">{notification.msg}</Alert>}

            {/* Stats Section */}
            <Row className="mb-5 g-4">
                <Col md={4}>
                    <div className="bg-white p-4 rounded-4 shadow-sm border-start border-4 border-primary">
                        <h5 className="text-muted mb-1">Total Listings</h5>
                        <h2 className="fw-bold mb-0">{myProperties.length}</h2>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="bg-white p-4 rounded-4 shadow-sm border-start border-4 border-success">
                        <h5 className="text-muted mb-1">Interested Buyers</h5>
                        <h2 className="fw-bold mb-0">{leads.length}</h2>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="bg-white p-4 rounded-4 shadow-sm border-start border-4 border-warning">
                        <h5 className="text-muted mb-1">Pending Approval</h5>
                        <h2 className="fw-bold mb-0">{myProperties.filter((p: any) => p.status === 'PENDING').length}</h2>
                    </div>
                </Col>
            </Row>

            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'listings')} className="mb-4 border-bottom-0">
                <Tab eventKey="listings" title={<span className="fw-bold px-3">My Listings</span>}>
                    {myProperties.length === 0 ? (
                        <div className="text-center py-5 bg-light rounded-4">
                            <h4 className="text-muted">No properties listed yet.</h4>
                            <Button variant="link" onClick={() => setShowAddModal(true)}>Add your first property</Button>
                        </div>
                    ) : (
                        <Row>
                            {myProperties.map((p: any) => (
                                <Col md={6} lg={4} key={p.id} className="mb-4">
                                    <div className="bg-white rounded-4 shadow-sm overflow-hidden h-100 border">
                                        <div className="position-relative" style={{ height: '200px' }}>
                                            <img
                                                src={p.images ? p.images.split(',')[0] : "https://via.placeholder.com/400x200"}
                                                alt="Property"
                                                className="w-100 h-100 object-fit-cover"
                                            />
                                            <Badge bg={p.status === 'APPROVED' ? 'success' : p.status === 'REJECTED' ? 'danger' : 'warning'} className="position-absolute top-0 end-0 m-3 shadow-sm">
                                                {p.status}
                                            </Badge>
                                            {p.status === 'REJECTED' && p.rejectionReason && (
                                                <div className="text-danger small mt-1">
                                                    <strong>Reason:</strong> {p.rejectionReason}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="fw-bold mb-0 text-truncate" style={{ maxWidth: '70%' }}>{p.title || p.type}</h5>
                                                <h6 className="text-primary fw-bold">₹ {p.price.toLocaleString()}</h6>
                                            </div>
                                            <p className="text-muted small mb-3 text-truncate">{p.address}, {p.city}</p>

                                            <div className="d-flex gap-2">
                                                <Button variant="outline-primary" size="sm" className="flex-grow-1 rounded-pill" onClick={() => {
                                                    setNewProperty(p);
                                                    setShowAddModal(true);
                                                }}>
                                                    Edit
                                                </Button>
                                                <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={() => handleDelete(p.id)}>
                                                    <Trash size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Tab>
                <Tab eventKey="leads" title={<span className="fw-bold px-3">Interested Buyers</span>}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h5 className="mb-3 d-flex align-items-center gap-2">
                                <Heart className="text-danger" size={20} /> Buyers who liked your properties
                            </h5>
                            {leads.length === 0 ? <p className="text-muted">No interested buyers yet.</p> : (
                                <Table responsive hover className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="py-3 ps-4">Property</th>
                                            <th className="py-3">Buyer Name</th>
                                            <th className="py-3">Contact Email</th>
                                            <th className="py-3">Contact Phone</th>
                                            <th className="py-3">Message Action</th>
                                            <th className="py-3 pe-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leads.map((l: any) => (
                                            <tr key={l.id}>
                                                <td className="ps-4 fw-medium py-3">{l.property.title}</td>
                                                <td className="py-3">{l.user.name}</td>
                                                <td className="py-3">{l.user.email}</td>
                                                <td className="py-3">{l.user.phone || 'N/A'}</td>
                                                <td className="py-3">
                                                    <div className="d-flex gap-2">
                                                        <a href={`mailto:${l.user.email}`} className="btn btn-sm btn-light rounded-circle border"><Mail size={14} /></a>
                                                        {l.user.phone && <a href={`https://wa.me/${l.user.phone}`} target="_blank" className="btn btn-sm btn-success rounded-circle text-white"><MessageCircle size={14} /></a>}
                                                    </div>
                                                </td>
                                                <td className="pe-4 py-3">{new Date(l.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>
                <Tab eventKey="sold" title={<span className="fw-bold px-3">Sold Properties</span>}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            {transactions.length === 0 ? <p className="text-muted">No sold properties yet.</p> : (
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>Transaction ID</th>
                                            <th>Property</th>
                                            <th>Buyer</th>
                                            <th>Amount (5%)</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((t: any) => (
                                            <tr key={t.id}>
                                                <td><small className="font-monospace">{t.transactionId}</small></td>
                                                <td>{t.property.title}</td>
                                                <td>
                                                    <div>{t.buyer.name}</div>
                                                    <small className="text-muted">{t.buyer.phone}</small>
                                                </td>
                                                <td className="text-success fw-bold">₹ {t.amount.toLocaleString()}</td>
                                                <td>{new Date(t.paymentDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>

            {/* Add/Edit Property Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">{newProperty.id ? 'Edit Property' : 'Add New Property'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Property Title / Headline</Form.Label>
                            <Form.Control
                                placeholder="e.g. Luxurious Villa in Mumbai"
                                value={newProperty.title || ''}
                                onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                            />
                        </Form.Group>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Property Type</Form.Label>
                                    <Form.Select
                                        value={newProperty.type}
                                        onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
                                        className="form-select"
                                    >
                                        <option value="HOUSE">House</option>
                                        <option value="FARM">Farm Land</option>
                                        <option value="LAND">Plot / Land</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Price (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={newProperty.price}
                                        onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        value={newProperty.city}
                                        onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Area (Sqft / Acres)</Form.Label>
                                    <Form.Control
                                        value={newProperty.area}
                                        onChange={(e) => setNewProperty({ ...newProperty, area: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Address</Form.Label>
                            <Form.Control
                                value={newProperty.address}
                                onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                            />
                        </Form.Group>

                        {/* Live Map Preview */}
                        <div className="mb-3">
                            <Form.Label>Location Preview</Form.Label>
                            <div className="rounded-3 overflow-hidden border" style={{ height: '300px' }}>
                                <PropertyMap location={`${newProperty.address}, ${newProperty.city}`} />
                            </div>
                        </div>

                        {newProperty.type === 'HOUSE' && (
                            <Row className="mb-3">
                                <Col>
                                    <Form.Control placeholder="Beds" type="number" value={newProperty.beds} onChange={(e) => setNewProperty({ ...newProperty, beds: e.target.value })} />
                                </Col>
                                <Col>
                                    <Form.Control placeholder="Baths" type="number" value={newProperty.baths} onChange={(e) => setNewProperty({ ...newProperty, baths: e.target.value })} />
                                </Col>
                                <Col>
                                    <Form.Control placeholder="BHK (e.g. 2BHK)" value={newProperty.bhk} onChange={(e) => setNewProperty({ ...newProperty, bhk: e.target.value })} />
                                </Col>
                            </Row>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={newProperty.description} onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image URL (Comma separated for multiple)</Form.Label>
                            <Form.Control value={newProperty.images} onChange={(e) => setNewProperty({ ...newProperty, images: e.target.value })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowAddModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleAddProperty} className="px-4 rounded-pill">
                        {newProperty.id ? 'Save Changes' : 'Submit Property'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default SellerDashboard;
