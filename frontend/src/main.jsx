import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';

import './index.css'
import App from './App.jsx'
import Login from './components/login.jsx';
import Register from './components/register.jsx';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import HomePage from './components/homePage';

// import Navbar from './components/navbar.jsx'

// we will use fragments instead of div, bcz we often need to group multiple elements together. Normally, we woould use a <div> or another HTML tag to do this. BUt adding extra tags like <div> can sometimes mess up with our layout or styles because it adds unnecessary HTML elements to our page.

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <App/>
     
  </StrictMode>,
)
