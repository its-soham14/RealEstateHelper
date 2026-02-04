import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import { GoogleMapsProvider } from './context/GoogleMapsContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Navigation from './components/Navigation';
// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PropertyDetails from './pages/PropertyDetails';
import Profile from './pages/Profile';

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
                console.error("Failed to parse user", e);
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
        return <div className="d-flex justify-content-center align-items-center vh-100">Loading...</div>;
    }

    return (
        <GoogleMapsProvider>
            <SearchProvider>
                <Router>
                    <div className="App">
                        <Navigation currentUser={currentUser} logout={logout} />
                        <Routes>
                            <Route path="/" element={<Home user={currentUser} />} />
                            <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
                            <Route path="/signup" element={<Signup />} />

                            {/* Profile Route */}
                            <Route path="/profile" element={currentUser ? <Profile user={currentUser} setUser={setCurrentUser} /> : <Navigate to="/login" />} />

                            {/* Protected Routes */}
                            <Route
                                path="/buyer/*"
                                element={currentUser?.role === 'BUYER' ? <BuyerDashboard user={currentUser} /> : <Navigate to="/login" />}
                            />
                            <Route
                                path="/seller/*"
                                element={currentUser?.role === 'SELLER' ? <SellerDashboard user={currentUser} /> : <Navigate to="/login" />}
                            />
                            <Route
                                path="/admin/*"
                                element={currentUser?.role === 'ADMIN' ? <AdminDashboard user={currentUser} /> : <Navigate to="/login" />}
                            />

                            <Route path="/property/:id" element={<PropertyDetails user={currentUser} />} />
                        </Routes>
                    </div>
                </Router>
            </SearchProvider>
        </GoogleMapsProvider>
    );
}

export default App;
