import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ currentUser, onLogout }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const handleLogout = () => {
        onLogout();
        setShowUserMenu(false);
    };

    const getRoleBadge = (role) => {
        const roleConfig = {
            'ADMIN': { class: 'role-admin', label: 'Administrator', icon: 'fa-crown' },
            'SUPERVISOR': { class: 'role-supervisor', label: 'Supervisor', icon: 'fa-user-shield' },
            'OPERATOR': { class: 'role-operator', label: 'Operator', icon: 'fa-user-cog' },
            'VIEWER': { class: 'role-viewer', label: 'Viewer', icon: 'fa-eye' }
        };
        const config = roleConfig[role] || roleConfig.VIEWER;
        
        return (
            <span className={`role-badge ${config.class}`}>
                <i className={`fas ${config.icon}`}></i>
                {config.label}
            </span>
        );
    };

    return (
        <header className="professional-header">
            <div className="header-content">
                {/* Left Section - Branding */}
                <div className="header-left">
                    <div className="logo">
                        <div className="logo-icon">
                            <i className="fas fa-industry"></i>
                        </div>
                        <div className="brand">
                            <h1 className="company-name">ZOHO</h1>
                            <p className="app-name">Task Management System</p>
                        </div>
                    </div>
                </div>

                {/* Center Section - Greeting */}
                <div className="header-center">
                    <div className="greeting">
                        <i className="fas fa-hand-wave"></i>
                        <span>{getGreeting()}, {currentUser.fullName}</span>
                    </div>
                    <div className="current-date">
                        {currentTime.toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>
                </div>

                {/* Right Section - User Info */}
                <div className="header-right">
                    <div className="time-display">
                        <div className="time-icon">
                            <i className="fas fa-clock"></i>
                        </div>
                        <div className="time-info">
                            <div className="current-time">
                                {currentTime.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}
                            </div>
                            <div className="time-label">Local Time</div>
                        </div>
                    </div>
                    
                    <div className="user-menu-container">
                        <div 
                            className="user-info"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <div className="user-avatar">
                                <i className="fas fa-user"></i>
                            </div>
                            <div className="user-details">
                                <div className="user-name">{currentUser.fullName}</div>
                                {getRoleBadge(currentUser.role)}
                            </div>
                            <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
                        </div>

                        {showUserMenu && (
                            <div className="user-dropdown">
                                <Link 
                                    to="/profile" 
                                    className="dropdown-item"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <i className="fas fa-user-cog"></i>
                                    Profile Settings
                                </Link>
                                <div className="dropdown-divider"></div>
                                <button 
                                    className="dropdown-item logout-btn"
                                    onClick={handleLogout}
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;