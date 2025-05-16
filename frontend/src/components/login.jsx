import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Login function");
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      console.log("response from BK:",response.data);
      // if (response.data.success) {
        localStorage.setItem("user_data", JSON.stringify(response.data));
        localStorage.setItem("token",response.data.token);
        const user_here=localStorage.getItem("user_data");
        console.log("user data stored is:", user_here);
        const token = localStorage.getItem("token");
        console.log("token stored is:",token);
        // alert('Login Successful!');
        navigate('/home'); // Redirect to HomePage
      // } else {
      //   alert('Login Failed! Check your credentials.');
      // }
    } catch (error) {
      alert('Login Failed! Error occurred.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        pattern="^[^@]+@(research|students)\.iiit\.ac\.in$"
        title="Please enter a valid IIIT Hyderabad email"
        required
      />

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} pattern=".{6,}" title="at least 6 characters long." required />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default Login;
