import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Building2, MapPin, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'BUYER',
        phone: '',
        companyName: '',
        address: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1); // 1: Signup, 2: OTP
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/api/auth/signup', formData);

            setSuccess('Registration successful! Please check your email for OTP.');
            setStep(2); // Move to OTP step
            window.scrollTo(0, 0);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response && err.response.data) {
                const data = err.response.data;
                if (typeof data === 'object') {
                    const messages = Object.values(data).join(', ');
                    setError(messages);
                } else {
                    setError(String(data));
                }
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/api/auth/verify-otp', {
                email: formData.email,
                otp
            });
            setSuccess('Email verified successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Invalid OTP.');
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center bg-light" style={{ minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%', maxWidth: '1000px' }}
            >
                <Card className="shadow-lg border-0 rounded-5 overflow-hidden">
                    <Row className="g-0">
                        {/* Left Info Panel */}
                        <Col
                            md={6}
                            className="d-none d-md-flex align-items-center justify-content-center text-white p-5"
                            style={{
                                background: 'linear-gradient(135deg, #198754, #4fd1a5)',
                            }}
                        >
                            <div>
                                <h2 className="fw-bold mb-3">Join RealEstateHelper 🏡</h2>
                                <p className="opacity-75">
                                    Create your account to explore verified properties,
                                    list your own properties, and connect instantly.
                                </p>
                            </div>
                        </Col>

                        {/* Right Form Panel */}
                        <Col md={6} className="p-5">
                            <h3 className="fw-bold mb-4 text-center">Create Your Account</h3>

                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            {step === 1 ? (
                                <Form onSubmit={handleSignup}>
                                    <Row>
                                        {/* Name */}
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Full Name</Form.Label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <User size={18} />
                                                    </span>
                                                    <Form.Control
                                                        name="name"
                                                        placeholder="Your name"
                                                        onChange={handleChange}
                                                        required
                                                        className="border-start-0"
                                                    />
                                                </div>
                                            </Form.Group>
                                        </Col>

                                        {/* Phone */}
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Phone</Form.Label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <Phone size={18} />
                                                    </span>
                                                    <Form.Control
                                                        name="phone"
                                                        placeholder="Mobile number"
                                                        onChange={handleChange}
                                                        required
                                                        className="border-start-0"
                                                    />
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Email */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <Mail size={18} />
                                            </span>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="Enter email"
                                                onChange={handleChange}
                                                required
                                                className="border-start-0"
                                            />
                                        </div>
                                    </Form.Group>

                                    {/* Password */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <Lock size={18} />
                                            </span>
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Create password"
                                                onChange={handleChange}
                                                required
                                                className="border-start-0 border-end-0"
                                            />
                                            <Button
                                                variant="light"
                                                className="bg-light border-start-0 border-top border-bottom"
                                                onClick={() => setShowPassword(!showPassword)}
                                                tabIndex="-1"
                                                style={{ borderColor: '#ced4da' }}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    {/* Role */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>I am a</Form.Label>
                                        <Form.Select name="role" onChange={handleChange} className="rounded-pill">
                                            <option value="BUYER">Buyer</option>
                                            <option value="SELLER">Seller</option>
                                        </Form.Select>
                                    </Form.Group>

                                    {/* Seller Extra Fields */}
                                    {formData.role === 'SELLER' && (
                                        <>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Company Name (Optional)</Form.Label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <Building2 size={18} />
                                                    </span>
                                                    <Form.Control
                                                        name="companyName"
                                                        placeholder="Company name"
                                                        onChange={handleChange}
                                                        className="border-start-0"
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Address</Form.Label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <MapPin size={18} />
                                                    </span>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={2}
                                                        name="address"
                                                        placeholder="Business address"
                                                        onChange={handleChange}
                                                        required
                                                        className="border-start-0"
                                                    />
                                                </div>
                                            </Form.Group>
                                        </>
                                    )}

                                    <Button
                                        variant="success"
                                        type="submit"
                                        className="w-100 rounded-pill py-3 fw-bold shadow-sm mt-3"
                                    >
                                        Send OTP
                                    </Button>
                                </Form>
                            ) : (
                                <Form onSubmit={handleVerify}>
                                    <div className="text-center mb-4">
                                        <div className="bg-light rounded-circle d-inline-flex p-3 mb-3">
                                            <Mail size={32} className="text-primary" />
                                        </div>
                                        <h4>Verify Your Email</h4>
                                        <p className="text-muted small">
                                            We've sent a 6-digit code to <strong>{formData.email}</strong>.
                                        </p>
                                    </div>

                                    <Form.Group className="mb-4">
                                        <Form.Label>One-Time Password (OTP)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            maxLength={6}
                                            className="text-center fs-4 letter-spacing-2"
                                            style={{ letterSpacing: '0.5em' }}
                                        />
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 rounded-pill py-3 fw-bold shadow-sm"
                                    >
                                        Verify Email
                                    </Button>

                                    <div className="text-center mt-3">
                                        <Button variant="link" className="text-muted text-decoration-none sm" onClick={() => setStep(1)}>
                                            Back to Signup
                                        </Button>
                                    </div>
                                </Form>
                            )}

                            <div className="text-center mt-4">
                                <small>
                                    Already have an account?{' '}
                                    <Link to="/login" className="fw-semibold text-decoration-none">
                                        Login
                                    </Link>
                                </small>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </motion.div>
        </Container >
    );
};

export default Signup;
