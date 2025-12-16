import React, { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';
import SummaryCards from './SummaryCards';
import TaskTable from './TaskTable';
import NewTaskModal from './NewTaskModal';

const TaskOverview = ({ currentUser }) => {
    const [tasks, setTasks] = useState([]);
    const [summary, setSummary] = useState({
        total: 0, completed: 0, inProgress: 0, onHold: 0, notStarted: 0
    });
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Check permissions
    const canCreateTask = ['ADMIN', 'SUPERVISOR'].includes(currentUser.role);
    const canDeleteTask = currentUser.role === 'ADMIN';

    // Calculate summary from tasks
    const calculateSummary = useCallback((taskList) => {
        const summaryData = {
            total: taskList.length,
            completed: taskList.filter(task => task.status === 'COMPLETED').length,
            inProgress: taskList.filter(task => task.status === 'IN_PROGRESS').length,
            onHold: taskList.filter(task => task.status === 'HOLD').length,
            notStarted: taskList.filter(task => task.status === 'NOT_STARTED').length
        };
        
        setSummary(summaryData);
        return summaryData;
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const response = await taskService.getAllTasks();
            const tasksData = response.data;
            setTasks(tasksData);
            calculateSummary(tasksData);
            showNotification('All tasks loaded successfully!', 'success');
        } catch (error) {
            showNotification('Error loading tasks!', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTaskUpdate = async (taskId, updatedTask) => {
        try {
            const response = await taskService.updateTask(taskId, updatedTask);
            const updatedTaskData = response.data;
            
            const updatedTasks = tasks.map(task => 
                task.id === taskId ? updatedTaskData : task
            );
            setTasks(updatedTasks);
            calculateSummary(updatedTasks);
            showNotification('Task updated successfully!', 'success');
        } catch (error) {
            showNotification('Error updating task!', 'error');
            throw error;
        }
    };

    const handleTaskDelete = async (taskId, taskName) => {
        if (!canDeleteTask) {
            showNotification('You do not have permission to delete tasks', 'error');
            return;
        }

        try {
            await taskService.deleteTask(taskId);
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            setTasks(updatedTasks);
            calculateSummary(updatedTasks);
            showNotification('Task deleted successfully!', 'success');
        } catch (error) {
            showNotification('Error deleting task!', 'error');
        }
    };

    const handleCreateTask = async (newTaskData) => {
        if (!canCreateTask) {
            showNotification('You do not have permission to create tasks', 'error');
            return;
        }

        try {
            const response = await taskService.createTask(newTaskData);
            const createdTask = response.data;
            
            const updatedTasks = [...tasks, createdTask];
            setTasks(updatedTasks);
            calculateSummary(updatedTasks);
            setShowNewTaskModal(false);
            showNotification(`Task "${createdTask.taskName}" created successfully!`, 'success');
        } catch (error) {
            showNotification('Error creating task!', 'error');
            throw error;
        }
    };

    // Filter tasks based on status and search term
    const filteredTasks = tasks.filter(task => {
        const matchesFilter = filter === 'all' || task.status === filter;
        const matchesSearch = task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.remarks.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (task.lastModifiedBy && task.lastModifiedBy.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const clearFilters = () => {
        setFilter('all');
        setSearchTerm('');
        showNotification('Filters cleared', 'info');
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 4000);
    };

    return (
        <div className="card professional-dashboard">
            {/* Header with User Role Info */}
            <div className="card-header professional-header">
                <div className="header-content">
                    <div className="header-main">
                        <h2 className="card-title professional-title">
                            <i className="fas fa-tachometer-alt"></i> Task Dashboard
                        </h2>
                        <p className="header-subtitle">
                            Welcome, {currentUser.fullName} • Role: {currentUser.role} • 
                            {summary.total} total tasks • Last updated: {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                    <div className="header-actions">
                        {loading && (
                            <div className="loading-indicator">
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Loading...</span>
                            </div>
                        )}
                        <button className="btn btn-primary professional-btn" onClick={loadTasks} disabled={loading}>
                            <i className="fas fa-sync-alt"></i> {loading ? 'Loading...' : 'Refresh'}
                        </button>
                        {canCreateTask && (
                            <button 
                                className="btn btn-success professional-btn" 
                                onClick={() => setShowNewTaskModal(true)}
                                disabled={loading}
                            >
                                <i className="fas fa-plus-circle"></i> Create Task
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Summary Cards */}
            <SummaryCards summary={summary} />
            
            {/* Enhanced Filters and Search */}
            <div className="filters-container professional-filters">
                <div className="filters-header">
                    <h3 className="filters-title">
                        <i className="fas fa-sliders-h"></i> Task Filters & Search
                    </h3>
                    {(filter !== 'all' || searchTerm) && (
                        <button 
                            onClick={clearFilters}
                            className="btn btn-outline clear-filters-btn"
                        >
                            <i className="fas fa-times"></i> Clear All
                        </button>
                    )}
                </div>
                
                <div className="filters-grid">
                    <div className="filter-group">
                        <label className="filter-label">
                            <i className="fas fa-filter"></i> Status Filter
                        </label>
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            className="filter-select professional-select"
                        >
                            <option value="all">📊 All Statuses ({summary.total})</option>
                            <option value="NOT_STARTED">📋 Not Started ({summary.notStarted})</option>
                            <option value="IN_PROGRESS">🔄 In Progress ({summary.inProgress})</option>
                            <option value="COMPLETED">✅ Completed ({summary.completed})</option>
                            <option value="HOLD">⏸️ On Hold ({summary.onHold})</option>
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <label className="filter-label">
                            <i className="fas fa-search"></i> Search Tasks
                        </label>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by task name, responsible person, remarks, or last modified by..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input professional-input"
                            />
                            <i className="fas fa-search search-icon"></i>
                        </div>
                    </div>
                </div>
                
                {(filter !== 'all' || searchTerm) && (
                    <div className="filter-results">
                        <span className="results-text">
                            Showing {filteredTasks.length} of {tasks.length} tasks
                            {filter !== 'all' && <span className="filter-tag">Status: {filter.replace('_', ' ')}</span>}
                            {searchTerm && <span className="filter-tag">Search: "{searchTerm}"</span>}
                        </span>
                    </div>
                )}
            </div>
            
            {/* Enhanced Tasks Table Container */}
            <div className="table-container">
                {filteredTasks.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-tasks empty-icon"></i>
                        <h3 className="empty-title">No tasks found</h3>
                        <p className="empty-description">
                            {tasks.length === 0 
                                ? 'No tasks available. Start by creating your first task.'
                                : 'No tasks match your current filters. Try adjusting your search criteria or filters.'
                            }
                        </p>
                        {tasks.length === 0 && canCreateTask && (
                            <button 
                                className="btn btn-success professional-btn empty-action" 
                                onClick={() => setShowNewTaskModal(true)}
                            >
                                <i className="fas fa-plus"></i> Create First Task
                            </button>
                        )}
                    </div>
                ) : (
                    <TaskTable 
                        tasks={filteredTasks} 
                        onTaskUpdate={handleTaskUpdate}
                        onTaskDelete={handleTaskDelete}
                        currentUser={currentUser}
                        canDeleteTask={canDeleteTask}
                    />
                )}
            </div>

            {/* Modals */}
            <NewTaskModal
                isOpen={showNewTaskModal}
                onClose={() => setShowNewTaskModal(false)}
                onTaskCreate={handleCreateTask}
                canCreateTask={canCreateTask}
            />

            {/* Notification */}
            {notification.show && (
                <div className={`notification professional-notification ${notification.type}`}>
                    <i className={`notification-icon fas ${
                        notification.type === 'success' ? 'fa-check-circle' :
                        notification.type === 'error' ? 'fa-exclamation-circle' :
                        notification.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'
                    }`}></i>
                    <span className="notification-message">{notification.message}</span>
                </div>
            )}
        </div>
    );
};

export default TaskOverview;