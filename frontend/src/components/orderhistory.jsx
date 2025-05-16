import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./navbar";

const OrderHistory = () => {
    const [orderData, setOrderData] = useState({
        orderedNotYetDelivered: [],
        deliveredToUser: [],
        deliveredByUser: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderOTPs, setOrderOTPs] = useState({});

    useEffect(() => {
        
    
        
        const fetchOrderHistory = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user_data'));

        if (!userData) {
          setError("User not logged in");
          return;
        }
        const userId = userData._id;
                const response = await axios.get(`http://localhost:5000/api/orders/history/${userId}`);
                setOrderData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrderHistory();

        const storedOTPs = JSON.parse(localStorage.getItem("orderOTPs")) || [];
        const otpMap = {};
        console.log("StoredOtp:".storedOTPs);
        storedOTPs.forEach(item => {
            otpMap[item.productId] = item.otp;
        });
        setOrderOTPs(otpMap);


    }, []);

    if (loading) return <p>Loading order history...</p>;
    if (error) return <p>Error fetching orders: {error}</p>;

    return (
        <div>
                <Navbar />

        <h2>Order History</h2>

        {/* Ordered But Not Delivered */}
        <div>
            <h3>Ordered, Not Yet Delivered</h3>
            {orderData.orderedNotYetDelivered.length > 0 ? (
                <ul>
                    {orderData.orderedNotYetDelivered.map((item, index) => (
                        <li key={index}>
                            <strong>Order ID:</strong> {item.orderId} <br />
                            <strong>Product ID:</strong> {item.productId} <br />
                            <strong>Name:</strong> {item.Name} <br />
                            <strong>Price:</strong> ₹{item.Price} <br />
                            <strong>Category:</strong> {item.Category} <br />
                            <strong>OTP:</strong> {orderOTPs[item.productId] || "Not Available"} <br />
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pending orders.</p>
            )}
        </div>

        {/* Delivered To User */}
        <div>
            <h3>Delivered to You</h3>
            {orderData.deliveredToUser.length > 0 ? (
                <ul>
                    {orderData.deliveredToUser.map((item, index) => (
                        <li key={index}>
                            <strong>Order ID:</strong> {item.orderId} <br />
                            <strong>Product ID:</strong> {item.productId} <br />
                            <strong>Name:</strong> {item.Name} <br />
                            <strong>Price:</strong> ₹{item.Price} <br />
                            <strong>Category:</strong> {item.Category} <br />
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No delivered orders.</p>
            )}
        </div>

        {/* Delivered By User (Sold by the user) */}
        <div>
            <h3>Delivered by You (Sold Items)</h3>
            {orderData.deliveredByUser.length > 0 ? (
                <ul>
                    {orderData.deliveredByUser.map((item, index) => (
                        <li key={index}>
                            
                            <strong>Product ID:</strong> {item.productId} <br />
                            <strong>Name:</strong> {item.Name} <br />
                            <strong>Price:</strong> ₹{item.Price} <br />
                            <strong>Category:</strong> {item.Category} <br />
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You haven't sold any items yet.</p>
            )}
        </div>
    </div>
    );
};

export default OrderHistory;





// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const OrderHistory = () => {
//     // const { userId } = useParams(); // Assuming userId is passed as a URL parameter
//     const [orders, setOrders] = useState({ pendingOrders: [], boughtItems: [] });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//   //  const userId = localStorage.getItem("userId"); // Ensure this exists

//   useEffect(() => {
//     const fetchOrderHistory = async () => {
//         const userData = JSON.parse(localStorage.getItem('user_data'));

//         if (!userData) {
//           setError("User not logged in");
//           return;
//         }
    
//         const userId = userData._id; 

       

//         try {
//             const response = await axios.get(`http://localhost:5000/api/orders/history/${userId}`);
//             console.log("User ID: ", userId);
//             console.log("Response: ", response.data);
//             setOrders(response.data);
//         } catch (err) {
//             setError('Failed to fetch orders');
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchOrderHistory();
// }, []); // ✅ No `userId` in dependency array


//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>{error}</div>;
//     }

//     return (
//         <div>
//             <h1>Order History</h1>
            
//             <div className="tabs">
//                 <div className="tab">
//                     <h2>Pending Orders</h2>
//                     <ul>
//                         {orders.pendingOrders.map((order) => (
//                             <li key={order._id}>
//                                 {order.items.map((item) => (
//                                     <div key={item.productId._id}>
//                                         <p>Product: {item.productId.name}</p>
//                                         <p>Price: {item.productId.price}</p>
//                                         <p>OTP: {item.otp}</p>
//                                     </div>
//                                 ))}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>

//                 <div className="tab">
//                     <h2>Bought Items</h2>
//                     <ul>
//                         {orders.boughtItems.map((order) => (
//                             <li key={order._id}>
//                                 {order.items.map((item) => (
//                                     <div key={item.productId._id}>
//                                         <p>Product: {item.productId.name}</p>
//                                         <p>Price: {item.productId.price}</p>
//                                     </div>
//                                 ))}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OrderHistory;
