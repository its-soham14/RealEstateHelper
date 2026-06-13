import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import { GoogleMapsProvider } from './context/GoogleMapsContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PropertyDetails from './pages/PropertyDetails';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Hides navbar on auth pages — must be inside Router to use useLocation
const AUTH_PATHS = ['/login', '/signup', '/forgot-password'];
const FOOTER_PATHS = ['/', '/about', '/privacy'];

function AppLayout({ currentUser, logout, children }) {
    const location = useLocation();
    const isAuthPage = AUTH_PATHS.includes(location.pathname);
    const showFooter = FOOTER_PATHS.includes(location.pathname);
    
    return (
        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {!isAuthPage && <Navigation currentUser={currentUser} logout={logout} />}
            <div style={{ flex: 1 }}>
                {children}
            </div>
            {showFooter && <Footer />}
        </div>
    );
}

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setCurrentUser(user);
            } catch (e) {
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setCurrentUser(null);
    };

    if (isLoading) {
        return (
            <div style={{
                background: '#000', minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: '1rem',
            }}>
                Loading...
            </div>
        );
    }

    return (
        <GoogleMapsProvider>
            <SearchProvider>
                <Router>
                    <AppLayout currentUser={currentUser} logout={logout}>
                        <Routes>
                            <Route path="/"        element={<Home user={currentUser} />} />
                            <Route path="/about"   element={<About />} />
                            <Route path="/privacy" element={<PrivacyPolicy />} />
                            <Route path="/login"   element={<Login setCurrentUser={setCurrentUser} />} />
                            <Route path="/signup"  element={<Signup />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/profile" element={currentUser ? <Profile user={currentUser} setUser={setCurrentUser} /> : <Navigate to="/login" />} />

                            <Route path="/buyer/*"  element={currentUser?.role === 'BUYER'  ? <BuyerDashboard  user={currentUser} /> : <Navigate to="/login" />} />
                            <Route path="/seller/*" element={currentUser?.role === 'SELLER' ? <SellerDashboard user={currentUser} /> : <Navigate to="/login" />} />
                            <Route path="/admin/*"  element={currentUser?.role === 'ADMIN'  ? <AdminDashboard  user={currentUser} /> : <Navigate to="/login" />} />

                            <Route path="/property/:id" element={<PropertyDetails user={currentUser} />} />
                        </Routes>
                    </AppLayout>
                </Router>
            </SearchProvider>
        </GoogleMapsProvider>
    );
}

export default App;
