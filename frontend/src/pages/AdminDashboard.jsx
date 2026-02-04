import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Tabs, Tab, Badge, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { Check, X, Shield, Users, Home, CreditCard, ExternalLink, Trash2, Info } from 'lucide-react';
import PropertyMap from '../components/PropertyMap';

// Custom styles for a premium look
const styles = {
    card: {
        border: 'none',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s ease'
    },
    statIcon: {
        width: '56px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px'
    },
    tableHeader: {
        backgroundColor: '#f8f9fa',
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        letterSpacing: '1px',
        fontWeight: 700,
        color: '#6c757d',
        borderTop: 'none'
    }
};

const AdminDashboard = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [pendingProperties, setPendingProperties] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showPropertyModal, setShowPropertyModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);

    // ... Logic remains identical to your original code ...
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
            setUsers(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchPendingProperties = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/api/properties/pending', { headers: { Authorization: `Bearer ${token}` } });
            setPendingProperties(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/api/transactions/all', { headers: { Authorization: `Bearer ${token}` } });
            setTransactions(res.data);
        } catch (e) {
            console.error(e);
            setTransactions([]);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchPendingProperties();
        fetchTransactions();
    }, []);

    const handlePropertyAction = async (id, status) => {
        if (status === 'REJECTED') {
            setSelectedPropertyId(id);
            setRejectionReason('');
            setShowRejectModal(true);
            return;
        }
        await updatePropertyStatus(id, status);
    };

    const submitRejection = async () => {
        if (selectedPropertyId) {
            await updatePropertyStatus(selectedPropertyId, 'REJECTED', rejectionReason);
            setShowRejectModal(false);
        }
    };

    const updatePropertyStatus = async (id, status, reason) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8081/api/properties/${id}/status`, null, {
                params: { status, reason },
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPendingProperties();
        } catch (e) { console.error(e); }
    };

    const handleViewUser = async (userId) => {
        try {
            const user = users.find((u) => u.id === userId);
            if (user) {
                setSelectedUser(user);
                setShowUserModal(true);
            } else {
                const res = await axios.get(`http://localhost:8081/api/users/${userId}`);
                setSelectedUser(res.data);
                setShowUserModal(true);
            }
        } catch (e) { console.error(e); }
    };

    const handleViewProperty = (property) => {
        setSelectedProperty(property);
        setShowPropertyModal(true);
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Is it okay to delete this user?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8081/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (e) { console.error(e); }
    };

    return (
        <Container className="py-5">
            {/* Header Section */}
            <div className="mb-5 d-flex justify-content-between align-items-end">
                <div>
                    <Badge bg="primary-subtle" className="text-primary px-3 py-2 mb-2 rounded-pill">Admin Portal</Badge>
                    <h1 className="fw-extrabold mb-0" style={{ letterSpacing: '-1px' }}>Dashboard Overview</h1>
                    <p className="text-muted mb-0">Manage your marketplace, users, and financial records.</p>
                </div>
                <div className="bg-white p-2 rounded-circle shadow-sm border">
                    <Shield size={28} className="text-primary" />
                </div>
            </div>

            {/* Stats Cards */}
            <Row className="mb-5 g-4">
                <Col md={4}>
                    <Card style={styles.card} className="p-3">
                        <div className="d-flex align-items-center">
                            <div style={{ ...styles.statIcon, background: '#e0eaff' }}>
                                <Users className="text-primary" />
                            </div>
                            <div className="ms-3">
                                <h6 className="text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '0.7rem' }}>Total Users</h6>
                                <h3 className="fw-bold mb-0">{users.length}</h3>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card style={styles.card} className="p-3">
                        <div className="d-flex align-items-center">
                            <div style={{ ...styles.statIcon, background: '#fff4e5' }}>
                                <Home className="text-warning" />
                            </div>
                            <div className="ms-3">
                                <h6 className="text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '0.7rem' }}>Pending Listings</h6>
                                <h3 className="fw-bold mb-0 text-warning">{pendingProperties.length}</h3>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card style={styles.card} className="p-3">
                        <div className="d-flex align-items-center">
                            <div style={{ ...styles.statIcon, background: '#e7f9ed' }}>
                                <CreditCard className="text-success" />
                            </div>
                            <div className="ms-3">
                                <h6 className="text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '0.7rem' }}>Live Transactions</h6>
                                <h3 className="fw-bold mb-0 text-success">{transactions.length}</h3>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Main Tabs Container */}
            <Tabs defaultActiveKey="moderation" className="custom-tabs mb-4 border-0">
                <Tab eventKey="moderation" title="Property Approval">
                    <Card style={styles.card} className="overflow-hidden">
                        <Card.Body className="p-0">
                            {pendingProperties.length === 0 ? (
                                <div className="p-5 text-center"><p className="text-muted">No pending approvals at the moment.</p></div>
                            ) : (
                                <Table hover responsive className="mb-0 align-middle">
                                    <thead style={styles.tableHeader}>
                                        <tr>
                                            <th className="ps-4">Seller</th>
                                            <th>Type</th>
                                            <th>Location</th>
                                            <th>Price</th>
                                            <th className="text-end pe-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingProperties.map((p) => (
                                            <tr key={p.id}>
                                                <td className="ps-4">
                                                    <div className="fw-bold">{p.seller.name}</div>
                                                    <small className="text-muted">{p.seller.email}</small>
                                                </td>
                                                <td><Badge pill bg="light" className="text-dark border">{p.type}</Badge></td>
                                                <td>
                                                    <div className="text-truncate" style={{ maxWidth: '200px' }}>{p.address}</div>
                                                    <small className="text-primary cursor-pointer" style={{ cursor: 'pointer' }} onClick={() => handleViewProperty(p)}>View Details</small>
                                                </td>
                                                <td className="fw-bold text-dark">₹{p.price.toLocaleString()}</td>
                                                <td className="text-end pe-4">
                                                    <div className="d-flex gap-2 justify-content-end">
                                                        <Button variant="success" size="sm" className="rounded-pill px-3" onClick={() => handlePropertyAction(p.id, 'APPROVED')}>
                                                            <Check size={14} className="me-1" /> Approve
                                                        </Button>
                                                        <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={() => handlePropertyAction(p.id, 'REJECTED')}>
                                                            <X size={14} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="users" title="User Management">
                    <Card style={styles.card} className="overflow-hidden">
                        <Card.Body className="p-0">
                            <Table hover responsive className="mb-0 align-middle">
                                <thead style={styles.tableHeader}>
                                    <tr>
                                        <th className="ps-4">User Details</th>
                                        <th>Role</th>
                                        <th className="text-end pe-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-light rounded-circle p-2 me-3 text-secondary"><Users size={16} /></div>
                                                    <div>
                                                        <div className="fw-bold">{u.name}</div>
                                                        <div className="text-muted small">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <Badge bg={u.role === 'ADMIN' ? 'dark' : u.role === 'SELLER' ? 'warning' : 'info'} pill className="px-3">
                                                    {u.role}
                                                </Badge>
                                            </td>
                                            <td className="text-end pe-4">
                                                {u.role !== 'ADMIN' && (
                                                    <Button variant="link" className="text-danger p-0" onClick={() => handleDeleteUser(u.id)}>
                                                        <Trash2 size={18} />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="transactions" title="Transactions">
                    <Card style={styles.card} className="overflow-hidden">
                        <Card.Body className="p-0">
                            <Table hover responsive className="mb-0 align-middle">
                                <thead style={styles.tableHeader}>
                                    <tr>
                                        <th className="ps-4">Transaction ID</th>
                                        <th>Parties</th>
                                        <th>Revenue (5%)</th>
                                        <th className="text-end pe-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((t) => (
                                        <tr key={t.id}>
                                            <td className="ps-4">
                                                <code className="text-muted small">{t.transactionId}</code>
                                                <div className="small fw-bold">{t.property.title}</div>
                                            </td>
                                            <td>
                                                <div className="small text-muted">B: {t.buyer.name}</div>
                                                <div className="small text-muted">S: {t.seller.name}</div>
                                            </td>
                                            <td><span className="text-success fw-bold">₹{t.amount.toLocaleString()}</span></td>
                                            <td className="text-end pe-4 text-muted small">{new Date(t.paymentDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>

            {/* Modals with enhanced styling */}
            <Modal show={showPropertyModal} onHide={() => setShowPropertyModal(false)} size="lg" centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                <Modal.Body className="p-0">
                    {selectedProperty && (
                        <div>
                            <div className="position-relative" style={{ height: '300px' }}>
                                <img
                                    src={selectedProperty.images ? selectedProperty.images.split(',')[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000'}
                                    alt="Property"
                                    className="w-100 h-100 object-fit-cover"
                                />
                                <Button
                                    variant="light"
                                    className="position-absolute top-0 end-0 m-3 rounded-circle shadow-sm"
                                    onClick={() => setShowPropertyModal(false)}
                                >
                                    <X size={20} />
                                </Button>
                            </div>
                            <div className="p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h3 className="fw-bold mb-1">{selectedProperty.title}</h3>
                                        <p className="text-muted mb-0"><Home size={16} className="me-1" /> {selectedProperty.address}, {selectedProperty.city}</p>
                                    </div>
                                    <h3 className="text-primary fw-bold">₹{selectedProperty.price.toLocaleString()}</h3>
                                </div>

                                <Row className="g-3 mb-4 text-center">
                                    <Col xs={3}><div className="bg-light p-2 rounded"><strong>{selectedProperty.area}</strong><br /><small className="text-muted">Sq.ft</small></div></Col>
                                    <Col xs={3}><div className="bg-light p-2 rounded"><strong>{selectedProperty.beds || 0}</strong><br /><small className="text-muted">Beds</small></div></Col>
                                    <Col xs={3}><div className="bg-light p-2 rounded"><strong>{selectedProperty.baths || 0}</strong><br /><small className="text-muted">Baths</small></div></Col>
                                    <Col xs={3}><div className="bg-light p-2 rounded"><strong>{selectedProperty.type}</strong><br /><small className="text-muted">Type</small></div></Col>
                                </Row>

                                <div className="mb-4">
                                    <PropertyMap location={`${selectedProperty.address}, ${selectedProperty.city}`} />
                                </div>

                                <div className="d-flex gap-3 justify-content-end pt-3 border-top">
                                    <Button variant="danger" className="px-4 py-2" onClick={() => { setShowPropertyModal(false); handlePropertyAction(selectedProperty?.id, 'REJECTED'); }}>Reject Listing</Button>
                                    <Button variant="success" className="px-4 py-2" onClick={() => { setShowPropertyModal(false); handlePropertyAction(selectedProperty?.id, 'APPROVED'); }}>Approve Listing</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Rejection Modal */}
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">Specify Rejection Reason</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        className="bg-light border-0"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Why is this listing being rejected?"
                    />
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowRejectModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={submitRejection} disabled={!rejectionReason}>Reject Permanently</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;
