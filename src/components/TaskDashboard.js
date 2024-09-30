import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import './TaskDashboard.css';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]); // Displayed tasks
  const [allTasks, setAllTasks] = useState([]); // All tasks fetched from the backend
  const [users, setUsers] = useState([]); // Users for admin to filter by
  const [page, setPage] = useState(1);
  const [currentTask, setCurrentTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assignedUserFilter, setAssignedUserFilter] = useState('');
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Fetch tasks based on current filters
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page,
          status: statusFilter,
          priority: priorityFilter,
          assignedUser: assignedUserFilter, // Ensure this matches your backend
        },
      });
      setTasks(response.data.tasks || []);
      setAllTasks(response.data.tasks || []); // Store all tasks for filtering
    } catch (error) {
      handleError(error);
    }
  };

  // Fetch users for admin to filter tasks by assigned user
  const fetchUsers = async () => {
    if (isAdmin) {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data); // Set the fetched users
      } catch (error) {
        handleError(error);
      }
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks whenever filters change
    fetchUsers(); // Fetch users on component mount
  }, [page, statusFilter, priorityFilter, assignedUserFilter]);

  // Filter tasks based on search term and filters
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    const matchesAssignedUser = assignedUserFilter ? task.assignedUser?._id === assignedUserFilter : true;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignedUser;
  });

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // Refresh tasks after deletion
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

  const handleError = (error) => {
    if (error.response) {
      alert(error.response.data.message || 'An unexpected error occurred');
    } else {
      alert('A network error occurred. Please check your connection.');
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    localStorage.removeItem('isAdmin'); // Remove admin status from local storage
    window.location.href = '/'; // Redirect to the login or home page
  };

  return (
    <div className="task-dashboard">
      <h2 className="dashboard-title">Your Tasks</h2>

      {/* Create Task and Logout Button Container */}
      <div className="header-buttons">
        <button className="create-task-button" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus"></i> Create New Task
        </button>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Filter Container */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={() => {}}>
          Search
        </button>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {isAdmin && ( // Show assigned user filter only for admin
          <select value={assignedUserFilter} onChange={(e) => setAssignedUserFilter(e.target.value)}>
            <option value="">All Assigned Users</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.username}</option>
            ))}
          </select>
        )}
      </div>

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
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
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
