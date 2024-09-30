import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import specific CSS file for Register form

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });

      // Handle success - redirect to login or dashboard
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2 className="register-title">Register</h2>
      
      {error && <p className="register-error">{error}</p>}
      
      <input
        className="register-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      
      <input
        className="register-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        className="register-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <input
        className="register-input"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      
      <button className="register-button" type="submit">Register</button>
    </form>
  );
};

export default Register;
