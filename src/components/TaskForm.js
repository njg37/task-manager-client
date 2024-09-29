// TaskForm.js
import React, {useEffect, useState } from 'react';
import axios from 'axios';

const TaskForm = ({ fetchTasks, currentTask, clearCurrentTask, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
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
    }
  }, [currentTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if we're editing or creating a task
    if (currentTask) {
      try {
        await axios.put(`http://localhost:5000/api/tasks/${currentTask._id}`, {
          title,
          description,
          dueDate,
          priority,
          status,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        clearCurrentTask(); // Clear form after editing
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update task');
      }
    } else {
      try {
        await axios.post('http://localhost:5000/api/tasks/create', {
          title,
          description,
          dueDate,
          priority,
          status,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create task');
      }
    }
    
    fetchTasks(); // Refresh task list
    setTitle(''); setDescription(''); setDueDate(''); setPriority('Medium'); setStatus('To Do'); // Reset form
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{currentTask ? 'Edit Task' : 'Create New Task'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      
      <button type="submit">{currentTask ? 'Update Task' : 'Create Task'}</button>
      {currentTask && <button onClick={clearCurrentTask}>Cancel Edit</button>}
      <button type="button" onClick={onClose}>Close</button>
    </form>
  );
};

export default TaskForm;