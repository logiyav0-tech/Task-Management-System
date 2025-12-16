import React, { useState } from 'react';

/**
 * UserProfile Component - Displays comprehensive user information and profile management options
 * 
 * @param {Object} props - Component props
 * @param {Object} props.currentUser - Current authenticated user object
 * @param {string} props.currentUser.fullName - User's full name
 * @param {string} props.currentUser.username - User's username
 * @param {string} props.currentUser.role - User's role (ADMIN, SUPERVISOR, OPERATOR, VIEWER)
 * @param {Function} props.onUserUpdate - Callback function to update user data
 * @returns {JSX.Element} User profile interface component
 */
const UserProfile = ({ currentUser, onUserUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: currentUser?.fullName || '',
        username: currentUser?.username || ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    /**
     * Get role-specific permission description
     * @param {string} role - User role
     * @returns {string} Permission description
     */
    const getPermissionDescription = (role) => {
        const permissions = {
            ADMIN: 'Full system access (Create, Read, Update, Delete)',
            SUPERVISOR: 'Create, read, and update tasks',
            OPERATOR: 'Read and update tasks (except completed ones)',
            VIEWER: 'Read-only access'
        };
        return permissions[role] || 'No permissions defined';
    };

    /**
     * Handle input changes for profile editing
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Handle password input changes
     */
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Validate profile form
     */
    const validateProfileForm = () => {
        const newErrors = {};
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Validate password form
     */
    const validatePasswordForm = () => {
        const newErrors = {};
        
        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }
        
        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handle profile edit action
     */
    const handleEditProfile = () => {
        setIsEditing(true);
        setFormData({
            fullName: currentUser?.fullName || '',
            username: currentUser?.username || ''
        });
        setErrors({});
    };

    /**
     * Handle profile save action
     */
    const handleSaveProfile = () => {
        if (!validateProfileForm()) return;

        // Call the update callback
        if (onUserUpdate) {
            onUserUpdate(formData);
        }
        
        setIsEditing(false);
        console.log('Profile updated:', formData);
    };

    /**
     * Handle cancel edit action
     */
    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({
            fullName: currentUser?.fullName || '',
            username: currentUser?.username || ''
        });
        setErrors({});
    };

    /**
     * Handle password change action
     */
    const handleChangePassword = () => {
        setIsChangingPassword(true);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    /**
     * Handle password save action
     */
    const handleSavePassword = () => {
        if (!validatePasswordForm()) return;

        // Implement password change logic here
        console.log('Password changed successfully');
        
        setIsChangingPassword(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    /**
     * Handle cancel password change
     */
    const handleCancelPasswordChange = () => {
        setIsChangingPassword(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    return (
        <div className="card professional-dashboard" role="main" aria-labelledby="profile-title">
            {/* Header Section */}
            <div className="card-header professional-header">
                <h2 id="profile-title" className="card-title professional-title">
                    <i className="fas fa-user-cog" aria-hidden="true"></i> 
                    User Profile
                </h2>
            </div>
            
            {/* Main Content Section */}
            <div className="profile-content">
                {/* User Information Section */}
                <div className="profile-info">
                    {/* Avatar/Profile Picture */}
                    <div className="profile-avatar" aria-hidden="true">
                        <i className="fas fa-user" title="User avatar"></i>
                    </div>
                    
                    {/* User Details */}
                    <div className="profile-details">
                        {isEditing ? (
                            // Edit Mode
                            <>
                                <div className="profile-field">
                                    <label htmlFor="full-name">Full Name:</label>
                                    <input
                                        type="text"
                                        id="full-name"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className={errors.fullName ? 'error' : ''}
                                        aria-describedby={errors.fullName ? 'full-name-error' : undefined}
                                    />
                                    {errors.fullName && (
                                        <span id="full-name-error" className="error-message">{errors.fullName}</span>
                                    )}
                                </div>
                                
                                <div className="profile-field">
                                    <label htmlFor="username">Username:</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className={errors.username ? 'error' : ''}
                                        aria-describedby={errors.username ? 'username-error' : undefined}
                                    />
                                    {errors.username && (
                                        <span id="username-error" className="error-message">{errors.username}</span>
                                    )}
                                </div>
                            </>
                        ) : (
                            // View Mode
                            <>
                                <div className="profile-field">
                                    <label htmlFor="full-name">Full Name:</label>
                                    <span id="full-name" className="profile-value">
                                        {currentUser?.fullName || 'Not provided'}
                                    </span>
                                </div>
                                
                                <div className="profile-field">
                                    <label htmlFor="username">Username:</label>
                                    <span id="username" className="profile-value">
                                        {currentUser?.username || 'Not provided'}
                                    </span>
                                </div>
                            </>
                        )}
                        
                        <div className="profile-field">
                            <label htmlFor="user-role">Role:</label>
                            <span 
                                id="user-role"
                                className={`role-badge role-${currentUser?.role?.toLowerCase() || 'unknown'}`}
                                aria-label={`User role: ${currentUser?.role}`}
                            >
                                {currentUser?.role || 'Unknown'}
                            </span>
                        </div>
                        
                        <div className="profile-field">
                            <label htmlFor="user-permissions">Permissions:</label>
                            <span id="user-permissions" className="profile-value">
                                {getPermissionDescription(currentUser?.role)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Password Change Form */}
                {isChangingPassword && (
                    <div className="password-change-form">
                        <h3>Change Password</h3>
                        <div className="profile-field">
                            <label htmlFor="current-password">Current Password:</label>
                            <input
                                type="password"
                                id="current-password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className={errors.currentPassword ? 'error' : ''}
                                aria-describedby={errors.currentPassword ? 'current-password-error' : undefined}
                            />
                            {errors.currentPassword && (
                                <span id="current-password-error" className="error-message">{errors.currentPassword}</span>
                            )}
                        </div>
                        
                        <div className="profile-field">
                            <label htmlFor="new-password">New Password:</label>
                            <input
                                type="password"
                                id="new-password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className={errors.newPassword ? 'error' : ''}
                                aria-describedby={errors.newPassword ? 'new-password-error' : undefined}
                            />
                            {errors.newPassword && (
                                <span id="new-password-error" className="error-message">{errors.newPassword}</span>
                            )}
                        </div>
                        
                        <div className="profile-field">
                            <label htmlFor="confirm-password">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className={errors.confirmPassword ? 'error' : ''}
                                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                            />
                            {errors.confirmPassword && (
                                <span id="confirm-password-error" className="error-message">{errors.confirmPassword}</span>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Action Buttons Section */}
                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button 
                                className="btn btn-success"
                                onClick={handleSaveProfile}
                                aria-label="Save profile changes"
                            >
                                <i className="fas fa-save" aria-hidden="true"></i> 
                                Save Changes
                            </button>
                            
                            <button 
                                className="btn btn-secondary"
                                onClick={handleCancelEdit}
                                aria-label="Cancel editing"
                            >
                                <i className="fas fa-times" aria-hidden="true"></i> 
                                Cancel
                            </button>
                        </>
                    ) : isChangingPassword ? (
                        <>
                            <button 
                                className="btn btn-success"
                                onClick={handleSavePassword}
                                aria-label="Save new password"
                            >
                                <i className="fas fa-save" aria-hidden="true"></i> 
                                Save Password
                            </button>
                            
                            <button 
                                className="btn btn-secondary"
                                onClick={handleCancelPasswordChange}
                                aria-label="Cancel password change"
                            >
                                <i className="fas fa-times" aria-hidden="true"></i> 
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                className="btn btn-primary"
                                onClick={handleEditProfile}
                                aria-label="Edit user profile"
                            >
                                <i className="fas fa-edit" aria-hidden="true"></i> 
                                Edit Profile
                            </button>
                            
                            <button 
                                className="btn btn-secondary"
                                onClick={handleChangePassword}
                                aria-label="Change password"
                            >
                                <i className="fas fa-key" aria-hidden="true"></i> 
                                Change Password
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;