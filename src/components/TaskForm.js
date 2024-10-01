import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TaskForm.css'; // Import specific CSS for TaskForm

const TaskForm = ({ fetchTasks, currentTask, clearCurrentTask, onClose, isAdmin }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
  const [assignedUser, setAssignedUser] = useState(''); // State for assigned user (admin only)
  const [users, setUsers] = useState([]); // List of available users for assignment
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  // Populate the form when editing a task
  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description);
      setDueDate(currentTask.dueDate.split('T')[0]); // Format due date
      setPriority(currentTask.priority);
      setStatus(currentTask.status);
      if (isAdmin && currentTask.assignedUser) {
        setAssignedUser(currentTask.assignedUser._id); // Set assignedUser for admin during edit
      }
    }
  }, [currentTask, isAdmin]);

  // Fetch users for assignment (only for admin users)
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return; // Only fetch users if the logged-in user is admin

      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data || []);
      } catch (error) {
        handleError(error);
      }
    };

    fetchUsers();
  }, [isAdmin, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let requestBody = {
        title,
        description,
        dueDate,
        priority,
        status
      };

      // Add assignedUser only if the user is admin and has selected an assignee
      if (isAdmin && assignedUser) {
        requestBody.assignedUser = assignedUser;
      }

      if (currentTask) {
        // Update existing task
        await axios.put(`http://localhost:5000/api/tasks/${currentTask._id}`, requestBody, {
          headers: { Authorization: `Bearer ${token}` },
        });
        clearCurrentTask(); // Clear form after editing
      } else {
        // Create a new task
        await axios.post('http://localhost:5000/api/tasks/create', requestBody, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchTasks(); // Refresh task list
      resetForm(); // Reset form fields
    } catch (err) {
      handleError(err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    setStatus('To Do');
    setAssignedUser('');
    setError('');
  };

  const handleError = (error) => {
    if (error.response) {
      setError(error.response.data.message || 'An unexpected error occurred');
    } else {
      setError('A network error occurred. Please check your connection.');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="task-form-title">{currentTask ? 'Edit Task' : 'Create New Task'}</h2>
      {error && <p className="task-form-error">{error}</p>}
      
      <input
        className="task-form-input"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <textarea
        className="task-form-textarea"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      
      <input
        className="task-form-input"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      
      <select className="task-form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      
      <select className="task-form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Only show user assignment dropdown for admin */}
      {isAdmin && users.length > 0 && (
        <div>
          <label className="task-form-label">Assign To:</label>
          <select className="task-form-select" value={assignedUser} onChange={(e) => setAssignedUser(e.target.value)}>
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
      )}

      <button className="task-form-button" type="submit">{currentTask ? 'Update Task' : 'Create Task'}</button>
      {currentTask && <button className="task-form-button" type="button" onClick={clearCurrentTask}>Cancel Edit</button>}
      <button className="task-form-button" type="button" onClick={onClose}>Close</button>
    </form>
  );
};

export default TaskForm;
