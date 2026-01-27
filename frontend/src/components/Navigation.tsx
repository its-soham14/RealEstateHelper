import React from 'react';
import { Navbar, Container, Nav, Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../App';
import { LogOut, User as UserIcon, Search } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

interface NavigationProps {
    currentUser: User | null;
    logout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentUser, logout }) => {
    const navigate = useNavigate();
    const { searchQuery, setSearchQuery } = useSearch();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleLogoClick = (e: React.MouseEvent) => {
        // Just navigate to home, do not logout
        if (currentUser) {
            // Allow default behavior (Link to "/")
        }
    };

    return (
        <Navbar expand="lg" className="bg-white shadow-sm fixed-top" style={{ padding: '1rem 0', height: 'var(--navbar-height)' }}>
            <Container>
                {/* @ts-ignore */}
                <Navbar.Brand as={Link as any} to="/" onClick={handleLogoClick} className="fw-bold text-primary fs-4" style={{ cursor: 'pointer' }}>
                    RealEstateHelper
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    {/* Centered Search Bar for Buyers Only */}
                    {currentUser?.role === 'BUYER' && (
                        <div className="mx-auto d-none d-lg-block" style={{ width: '40%' }}>
                            <InputGroup size="sm" className="shadow-sm rounded-pill overflow-hidden bg-light border-0">
                                <Form.Control
                                    placeholder="Search properties..."
                                    className="border-0 bg-light py-2 px-4 shadow-none start-0"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button variant="primary" className="rounded-circle m-1 p-2 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                                    <Search size={16} />
                                </Button>
                            </InputGroup>
                        </div>
                    )}


                    <Nav className="ms-auto align-items-center gap-3">
                        {(!currentUser || currentUser.role !== 'BUYER') && (
                            // @ts-ignore
                            <Nav.Link as={Link as any} to="/" className="fw-medium">Home</Nav.Link>
                        )}

                        {currentUser ? (
                            <>
                                {currentUser.role === 'BUYER' && (
                                    // @ts-ignore
                                    <Nav.Link as={Link as any} to="/buyer" className="fw-bold text-primary">Dashboard</Nav.Link>
                                )}
                                {currentUser.role === 'SELLER' && (
                                    // @ts-ignore
                                    <Nav.Link as={Link as any} to="/seller" className="fw-medium">Seller Dashboard</Nav.Link>
                                )}
                                {currentUser.role === 'ADMIN' && (
                                    // @ts-ignore
                                    <Nav.Link as={Link as any} to="/admin" className="fw-medium">Admin Panel</Nav.Link>
                                )}

                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="light" className="d-flex align-items-center gap-2 border-0 bg-light rounded-pill px-3 py-2">
                                        <UserIcon size={18} />
                                        <span>{currentUser.name}</span>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="shadow border-0 mt-2">
                                        <Dropdown.Item as={Link as any} to="/profile" className="d-flex align-items-center gap-2">
                                            <UserIcon size={16} /> My Profile
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout} className="text-danger d-flex align-items-center gap-2">
                                            <LogOut size={16} /> Logout
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                        ) : (
                            <div className="d-flex gap-2">
                                <Button as={Link as any} to="/login" variant="outline-primary" className="rounded-pill px-4">
                                    Login
                                </Button>
                                <Button as={Link as any} to="/signup" variant="primary" className="rounded-pill px-4">
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
