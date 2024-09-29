// TaskDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [currentTask, setCurrentTask] = useState(null); // Track the task being edited
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('token');

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks for page:', page);
      const response = await axios.get(`http://localhost:5000/api/tasks?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Raw API response:', response.data);
      setTasks(response.data.tasks || []);
      console.log('Tasks set in state:', tasks.length);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // Refresh the task list after deletion
    } catch (err) {
      console.error('Error deleting task', err.response?.data?.message || err.message);
    }
  };

  const editTask = (task) => {
    setCurrentTask(task); // Set the task to be edited
    setShowForm(true); // Show the form for editing
  };

  const clearCurrentTask = () => {
    setCurrentTask(null); // Clear the task being edited
    setShowForm(false); // Hide the form
  };

  useEffect(() => {
    fetchTasks().catch(error => {
      console.error('Error in useEffect:', error);
      setTasks([]);
    });
  }, [page]);

  return (
    <div>
      <h2>Your Tasks</h2>
      
      {/* Create Task Button */}
      {!showForm && (
        <button onClick={() => setShowForm(true)}>Create New Task</button>
      )}
      
      {/* Task Creation/Editing Form */}
      {showForm && (
        <TaskForm 
          fetchTasks={fetchTasks} 
          currentTask={currentTask}
          clearCurrentTask={clearCurrentTask}
          onClose={() => {
            setShowForm(false);
            fetchTasks(); // Fetch tasks again after closing the form
          }} 
        />
      )}
      
      {/* Task List */}
      <ul>
        {console.log('Number of tasks:', tasks.length)}
        {tasks.length > 0 ? (
          tasks.map(task => (
            <li key={task._id}>
              {task.title} - {task.status} - {task.priority}
              <button onClick={() => editTask(task)}>Edit</button> {/* Edit button */}
              <button onClick={() => deleteTask(task._id)}>Delete</button> {/* Delete button */}
            </li>
          ))
        ) : (
          <li>No tasks found.</li>
        )}
      </ul>

      {/* Pagination */}
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
};

export default TaskDashboard;