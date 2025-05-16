import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); // Ensures a 4-digit number
};




const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        console.log("Came");
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user_data'));

        if (!userData || !token) {
          setError("User not logged in");
          return;
        }

        const userId = userData._id;  // Get user ID from local storage
        console.log("UserId:", userId);
        // Step 1: Get the list of product IDs in the user's cart
        const cartResponse = await axios.get(`http://localhost:5000/api/users/cart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Response:", cartResponse.data);
        const productIds = cartResponse.data;  // Assuming response contains user_cart array
        //productId IS NOT id but whole product data, basically whole cart response so an array of all those data.
        console.log("Product details:", productIds);

        //total amount dynamic change by .reduce() option.
        const total = productIds.reduce((acc, product) => acc + (product.price || 0), 0);
        setTotalAmount(total);
        setCartItems(productIds);
        // if (!productIds || productIds.length === 0) {
        //   setCartItems([]);
        //   setLoading(false);
        //   return;
        // }

        // Step 2: Fetch details for each product ID
        // const productDetailsRequests = productIds.map(productId =>
        //   axios.get(http://localhost:5000/api/products/${productId}, {
        //     headers: { Authorization: Bearer ${token} },
        //   })
        // );

        // const productDetailsResponses = await Promise.all(productDetailsRequests);
        // const products = productDetailsResponses.map(res => res.data);

        // setCartItems(products);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to load cart items.");
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ✅ Recalculate `totalAmount` whenever `cartItems` change
  useEffect(() => {
    const newTotal = cartItems.reduce((acc, product) => acc + (product.price || 0), 0);
    setTotalAmount(newTotal);
  }, [cartItems]);

  // ✅ DELETE ITEM FROM CART FUNCTION
  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user_data'));

      if (!userData || !token) {
        setError("User not logged in");
        return;
      }

      const userId = userData._id;

      // Make API request to delete item from cart
      await axios.delete(`http://localhost:5000/api/users/cart/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId, productId },  // Passing data in request body
      });

      // Update frontend state after deletion
      setCartItems(cartItems.filter(item => item._id !== productId));

    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to remove item from cart.");
    }
  };

  //oder page
  // const handleProceedToCheckout = () => {
  //   localStorage.setItem('orderItems', JSON.stringify(cartItems)); // Store order items
  //   console.log("order items: ",cartItems);
  //   // navigate('/orders'); // Redirect to Orders Page
  // };

  const handleProceedToCheckout = async (cartItems) => {
    if (!cartItems.length) {
        alert("User not logged in or cart is empty!");
        return;
    }
    const token = localStorage.getItem('token');
        

    const userData = JSON.parse(localStorage.getItem('user_data'));

    if (!userData || !token) {
      setError("User not logged in");
      return;
    }

    const userId = userData._id; 
    // Generate OTPs for each item
    const itemsWithOTP = cartItems.map(item => ({
      productId: item._id,
      otp: generateOTP()
    }));

    // Store OTPs in localStorage
    localStorage.setItem("orderOTPs", JSON.stringify(itemsWithOTP));
    const storedOTPs = JSON.parse(localStorage.getItem("orderOTPs")) || [];
    const otpMap = {};
    console.log("StoredOtp:".storedOTPs);

    // Prepare request payload
    const orderData = {
      buyerId: userId,
      items: itemsWithOTP,
      status: "Ordered"
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (response.ok) {
        alert("Order placed successfully!");
          // ✅ Clear the cart in frontend
          setCartItems([]);  
        // localStorage.removeItem("orderOTPs"); // Clear stored OTPs after order
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((product) => (
              <li key={product._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3>{product.name}</h3>
                  <p>Price: ₹{product.price}</p>
                  <p>Category: {product.category}</p>
                  <img src={product.image} alt={product.name} style={{ width: "100px", height: "100px" }} />
                </div>
                <button
                  onClick={() => handleDelete(product._id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Total Sum Section */}
          <div style={{ marginTop: "20px", padding: "10px", borderTop: "2px solid #000" }}>
            <h3>Total Price: ₹{totalAmount}</h3>
            <button
              onClick={() => {
                alert(`Total amount: ₹${totalAmount}`);
                // const userData = JSON.parse(localStorage.getItem('user_data'));
                // if (userData && userData._id) {
                  handleProceedToCheckout(cartItems);
                // } else {
                //   alert("User not logged in!");
                // }
               
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "10px"
              }}
            >
              Checkout (₹{totalAmount})
            </button>

          </div>
        </div>
      )}
    </div>
  );
};
export default Cart; 