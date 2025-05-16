import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
// import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [cartCount, setCartCount] = useState(0); 


  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user_data');
  //   if (storedUser) {
  //     setUserData(JSON.parse(storedUser));
  //   }

  //   // ✅ Fetch cart count from API
  //   const fetchCartCount = async () => {
  //     try {
  //       const userData = JSON.parse(localStorage.getItem('user_data'));
  //       const token = localStorage.getItem('token');

  //       if (!userData || !token) return;

  //       const userId = userData._id;
  //       const response = await axios.get(`http://localhost:5000/api/users/cart/${userId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       // setCartCount(response.data.user_cart.length); // ✅ Update cart count
  //     } catch (error) {
  //       console.error("Error fetching cart count:", error);
  //     }
  //   };

  //   fetchCartCount();
  // }, []);


  const handleLogout = () => {
    localStorage.removeItem('user_data');
    localStorage.removeItem('token');
    setUserData(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">BuY-SeLL</div>
      <ul className="nav-links">
        {/* <li><Link to="/">Login</Link></li> */}
        {/* <li><Link to="/register">Register</Link></li> */}
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/cart">
            My Cart 
          </Link></li>
        <li><Link to="/myprofile">My Profile</Link></li>
        <li><Link to="/order-history">Order History</Link></li> {/* Link to Order History */}
        <li><Link to="/seller-orders">Delivery Orders</Link></li> {/* Add this link */}

        <li><button onClick={handleLogout}>Logout</button></li>
        {/* <button onClick={handleLogout}>Logout</button> */}
      </ul>
    </nav>
  );
};

export default Navbar;
