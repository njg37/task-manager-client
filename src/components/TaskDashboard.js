import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import './TaskDashboard.css';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [currentTask, setCurrentTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

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

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      handleError(err);
    }
  };

  const editTask = (task) => {
    setCurrentTask(task);
    setShowForm(true);
  };

  const clearCurrentTask = () => {
    setCurrentTask(null);
    setShowForm(false);
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
    <div className="task-dashboard">
      <h2 className="dashboard-title">Your Tasks</h2>
      
      {!showForm && (
        <button className="create-task-button" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus"></i> Create New Task
        </button>
      )}
      
      {showForm && (
        <TaskForm 
          fetchTasks={fetchTasks} 
          currentTask={currentTask}
          clearCurrentTask={clearCurrentTask}
          onClose={() => {
            setShowForm(false);
            fetchTasks();
          }}
          isAdmin={isAdmin}
        />
      )}
      
      <ul className="task-list">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <li key={task._id} className="task-item">
              <h3>{task.title}</h3> {/* Task Title */}
              <p>{task.description}</p> {/* Task Description */}
              <p>Status: {task.status}</p> {/* Task Status */}
              <p>Priority: {task.priority}</p> {/* Task Priority */}
              {isAdmin && task.assignedUser && (
                <p>Assigned to: {task.assignedUser.username}</p> // Assigned User
              )}
              <div className="task-item-buttons">
                <button className="edit-button" onClick={() => editTask(task)}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button className="delete-button" onClick={() => deleteTask(task._id)}>
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li>No tasks found.</li>
        )}
      </ul>

      <div className="pagination">
        <button className="pagination-button" onClick={() => setPage(page - 1)} disabled={page === 1}>
          <i className="fas fa-angle-left"></i> Previous
        </button>
        <button className="pagination-button" onClick={() => setPage(page + 1)}>
          <i className="fas fa-angle-right"></i> Next
        </button>
      </div>
    </div>
  );
};

export default TaskDashboard;
