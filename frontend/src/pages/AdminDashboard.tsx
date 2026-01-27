import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Tabs, Tab, Badge, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import type { User } from '../App';
import { Check, X, Shield, Users, Home } from 'lucide-react';
import PropertyMap from '../components/PropertyMap';

interface AdminDashboardProps {
    user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [pendingProperties, setPendingProperties] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showPropertyModal, setShowPropertyModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);

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

    const handlePropertyAction = async (id: number, status: string) => {
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

    const updatePropertyStatus = async (id: number, status: string, reason?: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8081/api/properties/${id}/status`, null, {
                params: { status, reason },
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPendingProperties();
        } catch (e) { console.error(e); }
    };

    const handleViewUser = async (userId: number) => {
        try {
            const user = users.find((u: any) => u.id === userId);
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

    const handleViewProperty = (property: any) => {
        setSelectedProperty(property);
        setShowPropertyModal(true);
    };

    const handleDeleteUser = async (id: number) => {
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
        <Container className="py-4">
            <div className="d-flex align-items-center gap-3 mb-4">
                <Shield size={32} className="text-primary" />
                <h2 className="fw-bold mb-0">Admin Dashboard</h2>
            </div>

            <Row className="mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm p-3 mb-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary"><Users /></div>
                            <div>
                                <h6 className="text-muted mb-0">Total Users</h6>
                                <h3 className="fw-bold mb-0">{users.length}</h3>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm p-3 mb-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning"><Home /></div>
                            <div>
                                <h6 className="text-muted mb-0">Pending Approvals</h6>
                                <h3 className="fw-bold mb-0">{pendingProperties.length}</h3>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Tabs defaultActiveKey="moderation" className="mb-4">
                <Tab eventKey="moderation" title="Property Moderation">
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            {pendingProperties.length === 0 ? <p className="text-muted">No pending properties.</p> : (
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Seller</th>
                                            <th>Type</th>
                                            <th>Details</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingProperties.map((p: any) => (
                                            <tr key={p.id}>
                                                <td>{p.id}</td>
                                                <td>
                                                    <Button variant="outline-primary" size="sm" onClick={() => handleViewUser(p.seller.id)} className="me-2 text-decoration-none">
                                                        {p.seller.name}
                                                    </Button>
                                                </td>
                                                <td><Badge bg="info">{p.type}</Badge></td>
                                                <td>
                                                    <span className="d-block text-truncate" style={{ maxWidth: '150px' }}>{p.address}, {p.city}</span>
                                                    <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => handleViewProperty(p)}>View Full Details</Button>
                                                </td>
                                                <td>₹ {p.price}</td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <Button variant="success" size="sm" onClick={() => handlePropertyAction(p.id, 'APPROVED')}>
                                                            <Check size={16} />
                                                        </Button>
                                                        <Button variant="danger" size="sm" onClick={() => handlePropertyAction(p.id, 'REJECTED')}>
                                                            <X size={16} />
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
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u: any) => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td><Badge bg={u.role === 'ADMIN' ? 'dark' : u.role === 'SELLER' ? 'warning' : 'primary'}>{u.role}</Badge></td>
                                            <td>
                                                {u.role !== 'ADMIN' && (
                                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(u.id)}>
                                                        Delete
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
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            {transactions.length === 0 ? <p className="text-muted">No transactions found.</p> : (
                                <Table responsive hover striped>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Property</th>
                                            <th>Buyer</th>
                                            <th>Seller</th>
                                            <th>Amount (5%)</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((t: any) => (
                                            <tr key={t.id}>
                                                <td><small className="font-monospace">{t.transactionId}</small></td>
                                                <td>{t.property.title}</td>
                                                <td>{t.buyer.name} <small className="text-muted">({t.buyer.email})</small></td>
                                                <td>{t.seller.name} <small className="text-muted">({t.seller.email})</small></td>
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

            {/* User/Seller Details Modal */}
            <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser ? (
                        <div>
                            <div className="text-center mb-4">
                                <div className="bg-light rounded-circle d-inline-flex p-3 mb-2 text-primary">
                                    <Users size={48} />
                                </div>
                                <h4>{selectedUser.name}</h4>
                                <Badge bg="secondary">{selectedUser.role}</Badge>
                            </div>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                            <p><strong>Address:</strong> {selectedUser.address || 'N/A'}</p>
                            {selectedUser.role === 'SELLER' && <p><strong>Company:</strong> {selectedUser.companyName || 'N/A'}</p>}
                        </div>
                    ) : <p>Loading...</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUserModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Property Details Modal */}
            <Modal show={showPropertyModal} onHide={() => setShowPropertyModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Property Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProperty ? (
                        <div>
                            {/* Hero Image in Modal */}
                            <div className="rounded-3 overflow-hidden shadow-sm mb-3 position-relative" style={{ height: '250px' }}>
                                <img
                                    src={selectedProperty.images ? selectedProperty.images.split(',')[0] : 'https://via.placeholder.com/800x400'}
                                    alt={selectedProperty.title}
                                    className="w-100 h-100 object-fit-cover"
                                />
                                <Badge bg="warning" className="position-absolute top-0 end-0 m-3 fs-6">
                                    {selectedProperty.status}
                                </Badge>
                            </div>

                            <h3 className="fw-bold mb-2">{selectedProperty.title || selectedProperty.type}</h3>
                            <p className="text-muted d-flex align-items-center gap-2 mb-3">
                                <Home size={18} /> {selectedProperty.address}, {selectedProperty.city}
                            </p>

                            {/* Location Map */}
                            <div className="mb-4 rounded-3 overflow-hidden border" style={{ height: '250px' }}>
                                <PropertyMap location={`${selectedProperty.address}, ${selectedProperty.city}`} />
                            </div>

                            <h4 className="text-primary fw-bold mb-4">₹ {selectedProperty.price.toLocaleString()}</h4>

                            <Row className="mb-4">
                                <Col><strong>Type:</strong> {selectedProperty.type}</Col>
                                <Col><strong>Area:</strong> {selectedProperty.area}</Col>
                                {selectedProperty.type === 'HOUSE' && (
                                    <>
                                        <Col><strong>Beds:</strong> {selectedProperty.beds}</Col>
                                        <Col><strong>Baths:</strong> {selectedProperty.baths}</Col>
                                    </>
                                )}
                            </Row>

                            <h5 className="fw-bold mb-2">Description</h5>
                            <p className="text-secondary">{selectedProperty.description}</p>

                            <hr />
                            <h6 className="fw-bold mb-2">Seller Info</h6>
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-light rounded-circle p-2"><Users size={20} /></div>
                                <div>
                                    <div className="fw-bold">{selectedProperty.seller.name}</div>
                                    <div className="small text-muted">{selectedProperty.seller.email}</div>
                                </div>
                            </div>
                        </div>
                    ) : <p>Loading...</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPropertyModal(false)}>Close</Button>
                    <Button variant="success" onClick={() => { setShowPropertyModal(false); handlePropertyAction(selectedProperty?.id, 'APPROVED'); }}>Approve Now</Button>
                    <Button variant="danger" onClick={() => { setShowPropertyModal(false); handlePropertyAction(selectedProperty?.id, 'REJECTED'); }}>Reject</Button>
                </Modal.Footer>
            </Modal>

            {/* Rejection Reason Modal */}
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reject Property</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Reason for Rejection</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g. Invalid documents, Poor image quality..."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRejectModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={submitRejection}>Confirm Rejection</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;
