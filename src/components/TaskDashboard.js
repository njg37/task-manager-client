import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [currentTask, setCurrentTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Convert string to boolean

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.tasks || []);
    } catch (error) {
      handleError(error);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // Refresh the task list after deletion
    } catch (err) {
      handleError(err);
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
    fetchTasks();
  }, [page]);

  const handleError = (error) => {
    if (error.response) {
      alert(error.response.data.message || 'An unexpected error occurred');
    } else {
      alert('A network error occurred. Please check your connection.');
    }
  };

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
          isAdmin={isAdmin} // Pass isAdmin prop
        />
      )}
      
      {/* Task List */}
      <ul>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <li key={task._id}>
              {task.title} - {task.status} - {task.priority}
              <button onClick={() => editTask(task)}>Edit</button>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
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
