import React, { useState } from 'react';

const NewTaskModal = ({ isOpen, onClose, onTaskCreate, canCreateTask }) => {
    const [newTask, setNewTask] = useState({
        taskName: '',
        responsible: '',
        remarks: '',
        priority: 'MEDIUM',
        category: 'Installation',
        estimatedHours: 8,
        department: 'Production',
        isCritical: false,
        startDate: '',
        endDate: ''
    });
    
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!canCreateTask) {
            alert('You do not have permission to create tasks!');
            return;
        }

        if (!newTask.taskName.trim()) {
            alert('Task name is required!');
            return;
        }

        setLoading(true);
        
        try {
            console.log('Creating task with data:', newTask);
            
            // Create the task object with all required fields
            const taskToCreate = {
                taskName: newTask.taskName.trim(),
                responsible: newTask.responsible.trim() || 'Unassigned',
                remarks: newTask.remarks.trim(),
                status: 'NOT_STARTED', // Default status
                priority: newTask.priority,
                category: newTask.category,
                estimatedHours: parseInt(newTask.estimatedHours) || 8,
                department: newTask.department,
                isCritical: newTask.isCritical || false,
                completionPercentage: 0, // Default completion
                startDate: newTask.startDate || null,
                endDate: newTask.endDate || null
            };
            
            console.log('Sending task data:', taskToCreate);
            
            await onTaskCreate(taskToCreate);
            
            // Reset form
            setNewTask({
                taskName: '',
                responsible: '',
                remarks: '',
                priority: 'MEDIUM',
                category: 'Installation',
                estimatedHours: 8,
                department: 'Production',
                isCritical: false,
                startDate: '',
                endDate: ''
            });
            
        } catch (error) {
            console.error('Error creating task:', error);
            alert(`Failed to create task: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewTask(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : 
                    type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    // Set default dates to today and 7 days from today
    const setDefaultDates = () => {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekFormatted = nextWeek.toISOString().split('T')[0];
        
        setNewTask(prev => ({
            ...prev,
            startDate: today,
            endDate: nextWeekFormatted
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="confirmation-modal" style={{display: 'flex'}}>
            <div className="modal-content" style={{maxWidth: '700px'}}>
                <div className="modal-header">
                    <h3 className="modal-title">
                        <i className="fas fa-plus-circle"></i> Create New Task
                    </h3>
                    <button 
                        className="close-btn" 
                        onClick={onClose}
                        disabled={loading}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    {/* Task Name - Full Width */}
                    <div className="form-group">
                        <label className="form-label">
                            Task Name *
                        </label>
                        <input
                            type="text"
                            name="taskName"
                            value={newTask.taskName}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter task name..."
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* First Row - Responsible & Priority */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Responsible Person
                            </label>
                            <input
                                type="text"
                                name="responsible"
                                value={newTask.responsible}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Operator A"
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={newTask.priority}
                                onChange={handleChange}
                                className="form-select"
                                disabled={loading}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                    </div>

                    {/* Second Row - Category & Department */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Category
                            </label>
                            <select
                                name="category"
                                value={newTask.category}
                                onChange={handleChange}
                                className="form-select"
                                disabled={loading}
                            >
                                <option value="Installation">Installation</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Testing">Testing</option>
                                <option value="Documentation">Documentation</option>
                                <option value="Safety">Safety</option>
                                <option value="Training">Training</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">
                                Department
                            </label>
                            <select
                                name="department"
                                value={newTask.department}
                                onChange={handleChange}
                                className="form-select"
                                disabled={loading}
                            >
                                <option value="Production">Production</option>
                                <option value="Quality">Quality</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Safety">Safety</option>
                                <option value="Engineering">Engineering</option>
                            </select>
                        </div>
                    </div>

                    {/* Third Row - Dates */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={newTask.startDate}
                                onChange={handleChange}
                                className="form-input"
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">
                                End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={newTask.endDate}
                                onChange={handleChange}
                                className="form-input"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Fourth Row - Hours & Critical */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Estimated Hours
                            </label>
                            <input
                                type="number"
                                name="estimatedHours"
                                value={newTask.estimatedHours}
                                onChange={handleChange}
                                className="form-input"
                                min="1"
                                max="1000"
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isCritical"
                                    checked={newTask.isCritical}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <span className="checkmark"></span>
                                Critical Task
                            </label>
                            <button 
                                type="button" 
                                className="btn btn-outline btn-sm"
                                onClick={setDefaultDates}
                                disabled={loading}
                            >
                                Set Default Dates
                            </button>
                        </div>
                    </div>

                    {/* Remarks - Full Width */}
                    <div className="form-group">
                        <label className="form-label">
                            Remarks
                        </label>
                        <textarea
                            name="remarks"
                            value={newTask.remarks}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="Enter any remarks or notes..."
                            rows="3"
                            disabled={loading}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="modal-buttons">
                        <button 
                            type="submit" 
                            className="btn btn-success"
                            disabled={loading || !canCreateTask}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Creating...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-plus"></i> Create Task
                                </>
                            )}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose}
                            disabled={loading}
                        >
                            <i className="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewTaskModal;