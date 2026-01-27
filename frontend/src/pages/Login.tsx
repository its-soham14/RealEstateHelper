import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import type { User } from '../App';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock } from 'lucide-react';

interface LoginProps {
    setCurrentUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setCurrentUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('BUYER');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', {
                email,
                password
            });

            const { token, id, name, role } = response.data;

            const user: User = { id, name, email, role, token };

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            setCurrentUser(user);

            if (role === 'BUYER') navigate('/buyer');
            else if (role === 'SELLER') navigate('/seller');
            else if (role === 'ADMIN') navigate('/admin');
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response && err.response.data) {
                const data = err.response.data;
                if (typeof data === 'object') {
                    // If backend sends field errors even for login
                    const messages = Object.values(data).join(', ');
                    setError(messages);
                } else {
                    setError(String(data));
                }
            } else {
                setError('Invalid credentials. Please try again.');
            }
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center bg-light" style={{ minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%', maxWidth: '950px' }}
            >
                <Card className="shadow-lg border-0 rounded-5 overflow-hidden">
                    <Row className="g-0">
                        {/* Left Image / Info Panel */}
                        <Col
                            md={6}
                            className="d-none d-md-flex align-items-center justify-content-center text-white p-5"
                            style={{
                                background: 'linear-gradient(135deg, #0d6efd, #4f9cff)',
                            }}
                        >
                            <div>
                                <h2 className="fw-bold mb-3">Welcome Back 👋</h2>
                                <p className="opacity-75">
                                    Login to manage your properties, connect with buyers and sellers,
                                    and explore verified listings easily.
                                </p>
                            </div>
                        </Col>

                        {/* Right Form Panel */}
                        <Col md={6} className="p-5">
                            <h3 className="fw-bold mb-4 text-center">Login to Your Account</h3>

                            {/* Role Switch */}
                            <div className="d-flex justify-content-center gap-2 mb-4 bg-light p-1 rounded-pill">
                                {['BUYER', 'SELLER', 'ADMIN'].map((role) => (
                                    <Button
                                        key={role}
                                        variant="light"
                                        className={`rounded-pill flex-fill ${selectedRole === role
                                            ? 'fw-bold shadow-sm text-primary'
                                            : 'text-muted'
                                            }`}
                                        onClick={() => setSelectedRole(role)}
                                        size="sm"
                                    >
                                        {role.charAt(0) + role.slice(1).toLowerCase()}
                                    </Button>
                                ))}
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleLogin}>
                                {/* Email */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <Mail size={18} />
                                        </span>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="border-start-0"
                                        />
                                    </div>
                                </Form.Group>

                                {/* Password */}
                                <Form.Group className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <Lock size={18} />
                                        </span>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="border-start-0"
                                        />
                                    </div>
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 rounded-pill py-3 fw-bold shadow-sm"
                                >
                                    Login
                                </Button>
                            </Form>

                            <div className="text-center my-3 position-relative">
                                <hr className="text-muted" />
                                <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">OR</span>
                            </div>

                            <div className="d-flex justify-content-center mb-3">
                                <GoogleLogin
                                    onSuccess={async (credentialResponse) => {
                                        try {
                                            const { credential } = credentialResponse;
                                            const response = await axios.post('http://localhost:8081/api/auth/google', { token: credential });

                                            const { token, id, name, role, email } = response.data;
                                            const user: User = { id, name, email, role, token };

                                            localStorage.setItem('user', JSON.stringify(user));
                                            localStorage.setItem('token', token);
                                            setCurrentUser(user);

                                            if (role === 'BUYER') navigate('/buyer');
                                            else if (role === 'SELLER') navigate('/seller');
                                            else if (role === 'ADMIN') navigate('/admin');
                                        } catch (err) {
                                            setError('Google Login Failed');
                                            console.error(err);
                                        }
                                    }}
                                    onError={() => {
                                        setError('Google Login Failed');
                                    }}
                                    useOneTap
                                    shape="pill"
                                />
                            </div>

                            <div className="text-center mt-4">
                                <small>
                                    Don&apos;t have an account?{' '}
                                    <Link to="/signup" className="fw-semibold text-decoration-none">
                                        Sign up
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

export default Login;
