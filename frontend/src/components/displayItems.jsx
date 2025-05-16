// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const DeliveryItems = () => {
//   const [orderedProducts, setOrderedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(""); // For category filtering

//   const token = localStorage.getItem("token");
//   const userData = JSON.parse(localStorage.getItem("user_data"));
//   const sellerId = userData ? userData._id : null;

//   useEffect(() => {
//     if (sellerId) {
//       fetchOrderedProducts();
//     } else {
//       setError("Seller ID not found. Please log in.");
//       setLoading(false);
//     }
//   }, [sellerId]);

//   const fetchOrderedProducts = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/orders/seller/${sellerId}`, {
//         headers: { Authorization: `Bearer ${token}` }, // Token for authentication
//       });
//       console.log("Data:",response)
//       if (response.data.success) {
//         setOrderedProducts(response.data.orderedProducts);
//       } else {
//         // setError("Failed to fetch ordered products.");
//       }
//     } catch (err) {
//       setError("Error fetching ordered products.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter products by selected category
//   const filteredProducts = orderedProducts.filter((product) =>
//     selectedCategory ? product.category === selectedCategory : true
//   );

//   return (
//     <div style={styles.container}>
//       <h2>Ordered Products for Delivery</h2>

//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {/* Category Filter Dropdown */}
//       <select
//         value={selectedCategory}
//         onChange={(e) => setSelectedCategory(e.target.value)}
//         style={styles.filterDropdown}
//       >
//         <option value="">All Categories</option>
//         {[...new Set(orderedProducts.map((p) => p.category))].map((category) => (
//           <option key={category} value={category}>
//             {category}
//           </option>
//         ))}
//       </select>

//       {/* Ordered Products List */}
//       <table style={styles.table}>
//         <thead>
//           <tr>
//             <th>Product Name</th>
//             <th>Price (₹)</th>
//             <th>Category</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredProducts.map((product) => (
//             <tr key={product._id}>
//               <td>{product.name}</td>
//               <td>{product.price}</td>
//               <td>{product.category}</td>
//               <td style={{ color: product.status === "ordered" ? "green" : "black" }}>
//                 {product.status}
//               </td>
//             </tr>

//           ))}
//         </tbody>
//       </table>

//       {filteredProducts.length === 0 && !loading && <p>No ordered products found.</p>}
//     </div>
//   );
// };

// // Basic CSS styles
// const styles = {
//   container: { padding: "20px", fontFamily: "Arial, sans-serif" },
//   table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
//   filterDropdown: { margin: "10px 0", padding: "5px" },
//   th: { borderBottom: "2px solid black", padding: "8px" },
//   td: { borderBottom: "1px solid gray", padding: "8px" },
// };

// export default DeliveryItems;



// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const SellerOrders = () => {
// //     const [sellerOrders, setSellerOrders] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);

// //     useEffect(() => {
// //         const fetchSellerOrders = async () => {
// //             try {
// //                 const userData = JSON.parse(localStorage.getItem("user_data"));

// //                 if (!userData) {
// //                     setError("User not logged in");
// //                     return;
// //                 }

// //                 const sellerId = userData._id; // Assuming sellerId is stored in user data
// //                 const response = await axios.get(`http://localhost:5000/api/orders/seller/${sellerId}`);

// //                 setSellerOrders(response.data.orders);
// //                 setLoading(false);
// //             } catch (err) {
// //                 setError(err.message);
// //                 setLoading(false);
// //             }
// //         };

// //         fetchSellerOrders();
// //     }, []);

// //     const handleOtpChange = (orderId, value) => {
// //         setOtpInputs((prev) => ({ ...prev, [orderId]: value }));
// //       };

// //     const handleVerifyOTP = async () => {
// //         if (!selectedOrder) {
// //           setMessage("Please select an order.");
// //           return;
// //         }
    
// //         try {
// //           const response = await axios.post("/verify-otp", {
// //             orderId: selectedOrder._id,
// //             enteredOtp: otp,
// //           });
    
// //           setMessage(response.data.message);
// //           // Refresh orders after verification
// //           setOrders((prevOrders) =>
// //             prevOrders.map((order) =>
// //               order._id === selectedOrder._id ? { ...order, status: "Delivered" } : order
// //             )
// //           );
// //         } catch (error) {
// //           setMessage(error.response?.data?.message || "Error verifying OTP");
// //         }
// //       };
    

// //     if (loading) return <p>Loading orders...</p>;
// //     if (error) return <p>Error fetching orders: {error}</p>;

// //     return (
// //         <div>
// //       <h2>Delivery History (Orders for Your Products)</h2>
// //       {sellerOrders.length > 0 ? (
// //         <ul>
// //           {sellerOrders.map((order, index) => (
// //             <li key={index}>
// //               <strong>Order ID:</strong> {order._id} <br />
// //               <strong>Buyer:</strong> {order.buyerId.name} <br />
// //               <strong>Email:</strong> {order.buyerId.email} <br />
// //               <strong>Status:</strong> {order.status} <br />
// //               <h4>Ordered Products:</h4>
// //               <ul>
// //                 {order.items.map((item, idx) => (
// //                   <li key={idx}>
// //                     <strong>Product:</strong> {item.productId.name} <br />
// //                     <strong>Price:</strong> ₹{item.productId.price} <br />
// //                     <strong>Category:</strong> {item.productId.category} <br />
// //                     <hr />
// //                   </li>
// //                 ))}
// //               </ul>

// //               {/* OTP Verification Section */}
// //               {order.status !== "Delivered" && (
// //                 <div>
// //                   <h4>Enter OTP to Mark as Delivered</h4>
// //                   <input
// //                     type="text"
// //                     value={otpInputs[order._id] || ""}
// //                     onChange={(e) => handleOtpChange(order._id, e.target.value)}
// //                     placeholder="Enter OTP"
// //                   />
// //                   <button onClick={() => handleVerifyOTP(order._id)}>Verify OTP</button>
// //                   {message[order._id] && <p>{message[order._id]}</p>}
// //                 </div>
// //               )}
// //             </li>
// //           ))}
// //         </ul>
// //       ) : (
// //         <p>No orders found for your products.</p>
// //       )}
// //     </div>
// //   );

// // };

// // export default SellerOrders;


import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar";

const DeliveryItems = () => {
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(""); // For category filtering
  const [otpInputs, setOtpInputs] = useState({}); // Store OTP inputs for each product

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const sellerId = userData ? userData._id : null;

  useEffect(() => {
    if (sellerId) {
      fetchOrderedProducts();
    } else {
      setError("Seller ID not found. Please log in.");
      setLoading(false);
    }
  }, [sellerId]);

  const fetchOrderedProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/seller/${sellerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setOrderedProducts(response.data.orderedProducts);
      } else {
        setError("Failed to fetch ordered products.");
      }
    } catch (err) {
      setError("Error fetching ordered products.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (productId, value) => {
    setOtpInputs({ ...otpInputs, [productId]: value });
  };

  // Handle OTP submission
  const submitOtp = async (productId) => {
    const otp = otpInputs[productId];
    if (!otp) {
      alert("Please enter an OTP.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/orders/verify-otp`,
        { productId, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update product status locally
        setOrderedProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? { ...product, status: "Delivered" } : product
          )
        );
        alert("OTP Verified! Product marked as Delivered.");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (err) {
      alert("Error verifying OTP.");
      console.error(err);
    }
  };

  // Filter products by selected category
  const filteredProducts = orderedProducts.filter((product) =>
    selectedCategory ? product.category === selectedCategory : true
  );

  return (
    <div style={styles.container}>
            <Navbar />

      <h2>Ordered Products for Delivery</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Category Filter Dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={styles.filterDropdown}
      >
        <option value="">All Categories</option>
        {[...new Set(orderedProducts.map((p) => p.category))].map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Ordered Products List */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price (₹)</th>
            <th>Category</th>
            <th>Status</th>
            <th>Enter OTP</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td style={{ color: product.status === "Ordered" ? "green" : "black" }}>
                {product.status}
              </td>
              <td>
                <input
                  type="text"
                  value={otpInputs[product._id] || ""}
                  onChange={(e) => handleOtpChange(product._id, e.target.value)}
                  placeholder="Enter OTP"
                  style={styles.otpInput}
                  disabled={product.status === "Delivered"} // Disable if already delivered
                />
              </td>
              <td>
                <button
                  onClick={() => submitOtp(product._id)}
                  disabled={product.status === "Delivered"} // Disable if already delivered
                  style={styles.submitButton}
                >
                  Submit OTP
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredProducts.length === 0 && !loading && <p>No ordered products found.</p>}
    </div>
  );
};

// Basic CSS styles
const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  filterDropdown: { margin: "10px 0", padding: "5px" },
  otpInput: { padding: "5px", width: "100px" },
  submitButton: { padding: "5px 10px", cursor: "pointer", backgroundColor: "blue", color: "white" },
};

export default DeliveryItems;

