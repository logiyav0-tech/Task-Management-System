import React, { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

/**
 * Login Component - Authentication interface for user login
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onLoginSuccess - Callback function triggered on successful login
 * @param {Function} props.onLoginFail - Optional callback for login failures
 * @returns {JSX.Element} Login form component
 */
const Login = ({ onLoginSuccess, onLoginFail }) => {
    // State management
    const [credentials, setCredentials] = useState({ 
        username: '', 
        password: '' 
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Demo accounts for testing
    const demoAccounts = [
        { role: 'Admin', username: 'admin', password: 'admin123', description: 'Full system access' },
        { role: 'Supervisor', username: 'supervisor', password: 'supervisor123', description: 'Manage tasks and teams' },
        { role: 'Operator', username: 'operator', password: 'operator123', description: 'Task operations' },
        { role: 'Viewer', username: 'viewer', password: 'viewer123', description: 'Read-only access' }
    ];

    /**
     * Form validation rules
     */
    const validateField = useCallback((name, value) => {
        const errors = {};
        
        switch (name) {
            case 'username':
                if (!value.trim()) {
                    errors.username = 'Username is required';
                } else if (value.length < 3) {
                    errors.username = 'Username must be at least 3 characters';
                } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    errors.username = 'Username can only contain letters, numbers, and underscores';
                }
                break;
                
            case 'password':
                if (!value) {
                    errors.password = 'Password is required';
                } else if (value.length < 6) {
                    errors.password = 'Password must be at least 6 characters';
                }
                break;
                
            default:
                break;
        }
        
        return errors;
    }, []);

    /**
     * Handle form submission
     */
    const handleSubmit = useCallback(async (e) => {
        if (e) {
            e.preventDefault();
        }
        setError('');
        setFormErrors({});

        // Validate all fields
        const usernameErrors = validateField('username', credentials.username);
        const passwordErrors = validateField('password', credentials.password);
        const allErrors = { ...usernameErrors, ...passwordErrors };

        if (Object.keys(allErrors).length > 0) {
            setFormErrors(allErrors);
            setTouched({ username: true, password: true });
            return;
        }

        setIsLoading(true);

        try {
            await authService.login(credentials.username, credentials.password);
            onLoginSuccess?.();
        } catch (error) {
            const errorMessage = error.response?.data?.message 
                || error.message 
                || 'Login failed. Please try again.';
            
            setError(errorMessage);
            onLoginFail?.(error);
            
            // Shake animation for error feedback
            const card = document.querySelector('.login-card');
            if (card) {
                card.classList.add('shake');
                setTimeout(() => card.classList.remove('shake'), 500);
            }
        } finally {
            setIsLoading(false);
        }
    }, [credentials, validateField, onLoginSuccess, onLoginFail]);

    /**
     * Handle input changes with validation
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field-specific error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Validate field in real-time if it's been touched
        if (touched[name]) {
            const errors = validateField(name, value);
            setFormErrors(prev => ({
                ...prev,
                ...errors
            }));
        }
    };

    /**
     * Handle field blur for validation
     */
    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        const errors = validateField(name, value);
        setFormErrors(prev => ({
            ...prev,
            ...errors
        }));
    };

    /**
     * Fill demo account credentials
     */
    const handleDemoAccount = (account) => {
        setCredentials({
            username: account.username,
            password: account.password
        });
        setError('');
        setFormErrors({});
        
        // Auto-submit after a short delay for better UX
        setTimeout(() => {
            const form = document.querySelector('.login-form');
            if (form) {
                form.dispatchEvent(
                    new Event('submit', { bubbles: true, cancelable: true })
                );
            }
        }, 100);
    };

    /**
     * Handle keyboard shortcuts
     */
    useEffect(() => {
        const handleKeyPress = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                handleSubmit(e);
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleSubmit]); // Fixed: Added handleSubmit to dependencies

    /**
     * Auto-focus username field on mount
     */
    useEffect(() => {
        const usernameInput = document.querySelector('input[name="username"]');
        if (usernameInput) {
            setTimeout(() => usernameInput.focus(), 100);
        }
    }, []);

    return (
        <div className="login-container" role="main" aria-label="Login page">
            <div className="login-card">
                {/* Header Section */}
                <div className="login-header">
                    <div className="logo">
                        <i className="fas fa-industry" aria-hidden="true"></i>
                        <h1>Project Task System</h1>
                    </div>
                    <p className="subtitle">Sign in to your account</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div 
                        className="alert alert-danger" 
                        role="alert"
                        aria-live="polite"
                    >
                        <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form 
                    onSubmit={handleSubmit} 
                    className="login-form"
                    noValidate
                    aria-label="Login form"
                >
                    {/* Username Field */}
                    <div className={`form-group ${formErrors.username ? 'error' : ''}`}>
                        <label htmlFor="username">
                            Username
                            <span className="required" aria-hidden="true">*</span>
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                            placeholder="Enter your username"
                            aria-describedby={formErrors.username ? "username-error" : undefined}
                            aria-invalid={!!formErrors.username}
                            autoComplete="username"
                            autoCapitalize="none"
                            autoCorrect="off"
                        />
                        {formErrors.username && (
                            <span 
                                id="username-error" 
                                className="error-message"
                                role="alert"
                                aria-live="polite"
                            >
                                <i className="fas fa-exclamation-triangle"></i>
                                {formErrors.username}
                            </span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className={`form-group ${formErrors.password ? 'error' : ''}`}>
                        <label htmlFor="password">
                            Password
                            <span className="required" aria-hidden="true">*</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                            placeholder="Enter your password"
                            aria-describedby={formErrors.password ? "password-error" : undefined}
                            aria-invalid={!!formErrors.password}
                            autoComplete="current-password"
                        />
                        {formErrors.password && (
                            <span 
                                id="password-error" 
                                className="error-message"
                                role="alert"
                                aria-live="polite"
                            >
                                <i className="fas fa-exclamation-triangle"></i>
                                {formErrors.password}
                            </span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className={`login-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                        aria-label={isLoading ? "Signing in, please wait" : "Sign in to your account"}
                    >
                        {isLoading ? (
                            <>
                                <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-sign-in-alt" aria-hidden="true"></i>
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                {/* Demo Accounts Section */}
                <div className="login-footer">
                    <p className="footer-text">Demo Credentials (Click to auto-fill):</p>
                    <div className="demo-accounts" role="list" aria-label="Demo accounts">
                        {demoAccounts.map((account) => (
                            <div 
                                key={account.role}
                                className="demo-account-item"
                                role="listitem"
                                onClick={() => handleDemoAccount(account)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleDemoAccount(account);
                                    }
                                }}
                                tabIndex={0}
                                aria-label={`Use ${account.role} demo account: ${account.description}`}
                            >
                                <strong>{account.role}:</strong> {account.username} / {account.password}
                                <span className="demo-description"> - {account.description}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Keyboard Shortcut Hint */}
                <div className="keyboard-hint">
                    <small>
                        <i className="fas fa-keyboard"></i>
                        Pro tip: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to submit
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Login;