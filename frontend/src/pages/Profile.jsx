import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import { UserCircle, Save, Edit3 } from 'lucide-react';

const Profile = ({ user, setUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        state: '',
        address: '',
        zip: '',
        companyName: ''
    });

    const [editMode, setEditMode] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8081/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const u = res.data;
                setFormData({
                    name: u.name || '',
                    phone: u.phone || '',
                    city: u.city || '',
                    state: u.state || '',
                    address: u.address || '',
                    zip: u.zip || '',
                    companyName: u.companyName || ''
                });
                // Update global user state seamlessly if needed, but form is priority
            } catch (e) {
                console.error("Failed to fetch profile", e);
            }
        };

        if (user) {
            // Initial load from props (fast)
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                city: user.city || '',
                state: user.state || '',
                address: user.address || '',
                zip: user.zip || '',
                companyName: user.companyName || ''
            });
            // Then fetch fresh data (authoritative)
            fetchProfile();
        }
    }, [user.id]); // Dependency on ID to prevent loops

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ ONLY save when Save Changes clicked
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            setNotification({ msg: 'Name cannot be empty.', type: 'danger' });
            return;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            setNotification({ msg: 'Phone number must be exactly 10 digits.', type: 'danger' });
            return;
        }
        if (formData.zip && !/^\d{6}$/.test(formData.zip)) {
            setNotification({ msg: 'Zip code must be 6 digits.', type: 'danger' });
            return;
        }

        const alphaRegex = /^[a-zA-Z\s]+$/;
        if ((formData.city && !alphaRegex.test(formData.city)) ||
            (formData.state && !alphaRegex.test(formData.state)) ||
            (formData.address && !alphaRegex.test(formData.address))) {
            setNotification({ msg: 'Address, City, and State must contain only alphabets.', type: 'danger' });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                'http://localhost:8081/api/users/profile',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotification({ msg: 'Profile updated successfully!', type: 'success' });
            setEditMode(false);
            setUser({ ...user, ...res.data });
        } catch (e) {
            setNotification({ msg: 'Failed to update profile.', type: 'danger' });
        }
    };

    return (
        <Container className="py-5" style={{ maxWidth: '1000px' }}>
            <Card className="shadow border-0 rounded-4 overflow-hidden">

                {/* ===== HEADER ===== */}
                <div
                    className="text-white text-center py-5"
                    style={{ background: 'linear-gradient(135deg, #5f72ff, #9b5cff)' }}
                >
                    <div className="mb-3">
                        <div className="bg-white bg-opacity-25 rounded-circle d-inline-flex p-3">
                            <UserCircle size={70} />
                        </div>
                    </div>

                    <h3 className="fw-bold mb-1">My Profile</h3>
                    <p className="mb-2 opacity-75">{user.email}</p>

                    <Badge bg="success" className="px-3 py-2 rounded-pill">
                        {user.role}
                    </Badge>
                </div>

                {/* ===== BODY ===== */}
                <Card.Body className="p-4 p-md-5">

                    <div className="d-flex align-items-center gap-2 mb-4">
                        <span className="border-start border-4 border-primary ps-2 fw-bold">
                            Personal Information
                        </span>
                    </div>

                    {notification && (
                        <Alert
                            variant={notification.type}
                            dismissible
                            onClose={() => setNotification(null)}
                        >
                            {notification.msg}
                        </Alert>
                    )}

                    {/* ✅ Form submit ONLY on Save Changes */}
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-4">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control value={user.email} disabled />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Zip Code</Form.Label>
                                    <Form.Control
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </Form.Group>
                            </Col>

                            {user.role === 'SELLER' && (
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Company Name</Form.Label>
                                        <Form.Control
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                        </Row>

                        {/* ✅ BUTTONS */}
                        <div className="mt-5 d-flex flex-column gap-3">
                            {/* Edit Button (not submit) */}
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-100 py-3 rounded-pill fw-bold"
                                onClick={() => setEditMode(true)}
                                disabled={editMode}
                            >
                                <Edit3 size={18} className="me-2" />
                                Edit Profile
                            </Button>

                            {/* Save Button (submit) */}
                            {editMode && (
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100 py-3 rounded-pill fw-bold"
                                >
                                    <Save size={18} className="me-2" />
                                    Save Changes
                                </Button>
                            )}
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;
