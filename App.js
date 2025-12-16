import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import TaskOverview from './components/TaskOverview';
import UserProfile from './components/UserProfile';
import authService from './services/authService';
import './styles/App.css';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        setLoading(false);
    }, []);

    const handleLoginSuccess = () => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
    };

    const handleLogout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner">
                    <i className="fas fa-cog fa-spin"></i>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                {currentUser ? (
                    <div className="app-container">
                        <Header currentUser={currentUser} onLogout={handleLogout} />
                        <div className="main-content">
                            <Routes>
                                <Route path="/" element={<TaskOverview currentUser={currentUser} />} />
                                <Route path="/profile" element={<UserProfile currentUser={currentUser} />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </div>
                    </div>
                ) : (
                    <Routes>
                        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                )}
            </div>
        </Router>
    );
}

export default App;