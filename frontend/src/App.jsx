import React from 'react';
import { BrowserRouter as Router, Route, Routes ,Navigate} from 'react-router-dom';
import HomePage from './components/homePage.jsx';  // Import HomePage component
import Login from './components/login.jsx';
import Register from './components/register.jsx';
import Navbar from './components/navbar.jsx';
import MyProfile from './components/myProfile.jsx';
import ProductDetails from './components/product_details.jsx';
import Cart from './components/cart.jsx';
import OrderHistory from './components/orderhistory.jsx';
import DeliveryItems from './components/displayItems.jsx';


const App = () => {
  return (
    <Router>
      {/* <Navbar /> Added Navbar here */}
      <Routes>
        

        <Route path="/" element={<Navigate to="/Register" />} /> {/* Redirect to Register first */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetails/>} />
        <Route path="/myprofile" element={<MyProfile/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/seller-orders" element={<DeliveryItems />} />

      </Routes>
    </Router>
  );
};

export default App;
