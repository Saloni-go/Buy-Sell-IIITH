import mongoose from "mongoose";
import Order from '../models/orders.js';
import Product from "../models/product.js";
import bcrypt from 'bcrypt';
import User from '../models/user.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


const hashOTP = async (otp) => {
    const saltRounds = 10;
    return await bcrypt.hash(otp, saltRounds);
};

// Place Order and Send OTP
//export const createProducts=async(req,res)=>{


export const createOrder = async (req, res) => {
    try {
        console.log("Came!!");
        const { buyerId, items, status } = req.body;

        if (!buyerId || !items || !items.length || !status) {
            return res.status(400).json({ message: "All fields are required, including at least one item." });
        }

        // const validStatuses = ["Pending", "Completed", "Cancelled"];
        // if (!validStatuses.includes(status)) {
        //     return res.status(400).json({ message: "Invalid status. Allowed values: 'Pending', 'Completed', 'Cancelled'." });
        // }

        // Validate items and hash OTPs
        console.log("here!");
        // const itemsWithHashedOTP = await Promise.all(items.map(async (item) => {
        //     if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        //         throw new Error("Invalid product ID");
        //     }

        //     const hashedOtp = await bcrypt.hash(item.otp, 10); // Hash OTP
        //     return { productId: item.productId, otp: hashedOtp };
        // }));

        const itemsWithHashedOTP = [];

        for (const item of items) {
            if (!item.productId) {
                throw new Error("Missing productId");
            }

            if (!mongoose.Types.ObjectId.isValid(item.productId)) {
                throw new Error(`Invalid product ID: ${item.productId}`);
            }

            if (!item.otp) {
                throw new Error("OTP is missing");
            }

            const hashedOtp = await bcrypt.hash(String(item.otp), 10); // Ensure OTP is a string
            itemsWithHashedOTP.push({ productId: item.productId, otp: hashedOtp });

            await Product.findByIdAndUpdate(item.productId, { status: "Ordered" });
            console.log(`Product ${item.productId} status updated to Ordered`);


        }

        console.log("Processed items:", itemsWithHashedOTP);

        console.log("Now!");
        const newOrder = new Order({ buyerId, items: itemsWithHashedOTP, status });
        const savedOrder = await newOrder.save();

        const user = await User.findById(buyerId);
        user.user_cart = [];
        await user.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// export const createOrder = async (req, res) => {

export const getHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("User ID:", userId);

        // 1️⃣ Fetch All Orders Placed by the User
        const allOrders = await Order.find({ buyerId: userId });

        console.log("All Orders:", allOrders);

        let orderedNotYetDelivered = [];
        let deliveredToUser = [];
        let deliveredByUser = [];

        // 2️⃣ Categorize Orders
        for (const order of allOrders) {
            console.log("Entered Order Loop!!!");
            console.log("Order ID:", order._id);

            for (const item of order.items) {
                // console.log("Processing Item:", item);
                console.log("ID:",item.productId);
                const product = await Product.findById(item.productId);
                console.log("Name:",product.name, "status:",product.status);
                // Check if item has a status
                // if (!item.status) {
                //     console.log("Skipping item - Missing status");
                //     continue;
                // }

                if (product.status === "Ordered") {
                    console.log("came ordered!");
                    orderedNotYetDelivered.push({
                        orderId: order._id,
                        productId: item.productId, // Directly using productId from order
                        Name: product.name,
                        Price: product.price,
                        Category: product.category,
                        Seller: product.sellerId,
                    });
                } else if (product.status === "Delivered" ) {
                    console.log("delivered buyer!!");
                    deliveredToUser.push({
                        orderId: order._id,
                        productId: item.productId, // Directly using productId
                        Name: product.name,
                        Price: product.price,
                        Category: product.category,
                        Seller: product.sellerId,
                    });
                } 

                // else if (product.status === "Delivered" && product.sellerId.toString() === userId) {
                //     console.log("Delivered seller!");
                //     deliveredByUser.push({
                //         orderId: order._id,
                //         productId: item.productId, // Directly using productId
                //         Name: product.name,
                //         Price: product.price,
                //         Category: product.category,
                //         Seller: product.sellerId,
                //     });
                // }
            }
        }
        const sellerId = userId;
        // const allOrd = await Order.find({ buyerId: userId });

        const orderedProducts = await Product.find({ sellerId, status: "Delivered" });
        console.log("seller!!");
        console.log("Seller Products:",orderedProducts);

        deliveredByUser = orderedProducts.map(product => ({

            productId: product._id, // Product ID
            Name: product.name,     // Product Name
            Price: product.price,   // Product Price
            Category: product.category // Product Category
           
        }));

        // if (!orderedProducts.length) {
        //     console.log("Cameee!!");
        //     return res.json({ message: "No ordered products found for this seller." });
        // }

        // console.log("Ordered Products:", orderedProducts);

        console.log("Ordered Not Delivered:", orderedNotYetDelivered);
        console.log("Delivered To User:", deliveredToUser);
        console.log("Delivered By User:", deliveredByUser);

        res.json({ orderedNotYetDelivered, deliveredToUser, deliveredByUser });
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).json({ error: error.message });
    }
};



// export const getSellerOrders = async (req, res) => {
//     console.log("Fetching seller's ordered products...");

//     try {
//         const sellerId = req.params.sellerId;
//         console.log("Seller ID:", sellerId);

//         // Fetch only the seller's products that have been ordered
//         const orderedProducts = await Product.find({ sellerId, status: "Ordered" });

//         console.log("Seller Products:",orderedProducts);
//         if (!orderedProducts.length) {
//             console.log("Cameee!!");
//             return res.json({ message: "No ordered products found for this seller." });
//         }
       

//         // Extract product IDs
//         const productIds = orderedProducts.map(product => product._id);

//         // Fetch orders that contain these products
//         const orders = await Order.find({ "items.productId": { $in: productIds } })
//             .populate("buyerId", "name email") // Fetch buyer details
//             .populate("items.productId", "name price category status"); // Fetch product details

//         console.log("Orders with buyer details:", orders);

//         // Structure the response
//         const result = orders.map(order => ({
//             buyer: {
//                 name: order.buyerId.name,
//                 email: order.buyerId.email
//             },
//             orderedItems: order.items
//                 .filter(item => productIds.includes(item.productId._id)) // Only seller's products
//                 .map(item => ({
//                     productName: item.productId.name,
//                     price: item.productId.price,
//                     category: item.productId.category,
//                     status: item.productId.status
//                 }))
//         }));

//         res.status(200).json({ success: true, orders: result });

//     } catch (error) {
//         console.error("Error fetching seller orders:", error);
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// };


export const getSellerOrders = async (req, res) => {
    console.log("Fetching seller's ordered products...");

    try {
        const sellerId = req.params.sellerId;
        console.log("Seller ID:", sellerId);

        // Fetch only the seller's products that have been ordered
        const orderedProducts = await Product.find({ sellerId, status: "Ordered" });

        console.log("Seller Products:",orderedProducts);
        if (!orderedProducts.length) {
            console.log("Cameee!!");
            return res.json({ message: "No ordered products found for this seller." });
        }

        console.log("Ordered Products:", orderedProducts);
        

        // Send only the ordered products to the frontend
        res.status(200).json({ success: true, orderedProducts });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};





// export const getSellerOrders = async (req, res) => {
//     console.log("2");
//     try {
//         const sellerId = req.params.sellerId;
//         console.log("seller ID:", sellerId);

//         // Fetch products belonging to this seller
//         const sellerProducts = await Product.find({ sellerId }).select("_id name price category");

//         if (!sellerProducts.length) {
//             return res.status(404).json({ message: "No products found for this seller." });
//         }

//         const productIds = sellerProducts.map(product => product._id);
//         console.log("product id's: ", productIds);

//         // Fetch orders that contain the seller's products
        // const orders = await Order.find({ "items.productId": { $in: productIds } })
        //     .populate("buyerId", "name email") // Fetch buyer details
        //     .populate("items.productId", "name price category"); // Fetch product details

//         res.status(200).json({ success: true, orders });
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// };



// export const getHistory = async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         console.log("User ID:", userId);

//         // 1️⃣ Fetch All Orders Placed by the User
//         const allOrders = await Order.find({ buyerId: userId })
//             .populate("items.productId");

//         console.log("All Orders:", allOrders);

//         // 2️⃣ Filter Pending Items (Items that are still "Ordered")
//         const pendingOrders = allOrders.map(order => ({
//             _id: order._id,
//             items: order.items.filter(item => item.status === "Ordered") // Filter only pending items
//         })).filter(order => order.items.length > 0); // Remove empty orders

//         console.log("Pending Orders:", pendingOrders);

//         // 3️⃣ Filter Completed Items (Items that are "Completed")
//         const boughtItems = allOrders.map(order => ({
//             _id: order._id,
//             items: order.items.filter(item => item.status === "Completed") // Filter only completed items
//         })).filter(order => order.items.length > 0);

//         console.log("Completed Items:", boughtItems);

//         // 4️⃣ Get Sold Items (Orders where the user is the Seller)
//         const allOrdersWithProducts = await Order.find({ "items.productId": { $exists: true } })
//             .populate("items.productId");

//         const soldItems = allOrdersWithProducts.map(order => ({
//             _id: order._id,
//             items: order.items.filter(item => item.productId.sellerId?.toString() === userId)
//         })).filter(order => order.items.length > 0);

//         console.log("Sold Items:", soldItems);

//         res.json({ pendingOrders, boughtItems, soldItems });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


// export const getHistory = async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         console.log("user id: ",userId);

//         // 1️⃣ Get Pending Orders (Placed by User)
//         const pendingOrders = await Order.find({ buyerId: userId, status: "Pending" })
//             .populate("items.productId");
//                 console.log("pending order:", pendingOrders);

//         // 2️⃣ Get Bought Items (Completed Orders by User)
//         const boughtItems = await Order.find({ buyerId: userId, status: "Completed" })
//             .populate("items.productId");
//             console.log("completed items: ",boughtItems);
//                 // console.log("completed order: ",items.productId);

//         // 3️⃣ Get Sold Items (Orders where user is the Seller)
//         const soldItems = await Order.find({ "items.productId": { $exists: true } }) // Fetch all orders with products
//             .populate("items.productId")
//             .then((orders) =>
//                 orders.filter((order) =>
//                     order.items.some((item) => item.productId.sellerId?.toString() === userId)
//                 )
//             );

//         res.json({ pendingOrders, boughtItems, soldItems });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

//     try {
//         const { buyerId, items, otp, status } = req.body;

//         // Validate required fields
//         if (!buyerId || !otp || !status || !items || !items.length) {
//             return res.status(400).json({ message: "All fields are required, including at least one item." });
//         }

//         // Validate status
//         const validStatuses = ["Pending", "Completed", "Cancelled"];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({ message: "Invalid status. Allowed values: 'Pending', 'Completed', 'Cancelled'." });
//         }

//         // Validate that each item in the items array is a valid ObjectId
//         if (!Array.isArray(items) || !items.every(item => mongoose.Types.ObjectId.isValid(item))) {
//             return res.status(400).json({ message: "Invalid items. Each item must be a valid ObjectId." });
//         }

//         // Create new order
//         const newOrder = new Order({
//             buyerId,
//             items,
//             otp,
//             status
//         });

//         // Save order to database
//         const savedOrder = await newOrder.save();

//         res.status(201).json(savedOrder);
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// };

// export const createOrder=async(req,res)=>{
//     try {
//         const { buyerId,  items, otp, status } = req.body;

//         // Validate required fields
//         if (!buyerId || !otp || !status) {
//             return res.status(400).json({ message: "All fields are required, including status." });
//         }

//         // Validate status
//         const validStatuses = ["Pending", "Completed"];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({ message: "Invalid status. Allowed values: 'Pending' or 'Completed'." });
//         }

//         // Create new order
//         const newOrder = new Order({
//             buyerId,
//             items,
//             otp,
//             status
//         });

//         // Save order to database
//         const savedOrder = await newOrder.save();

//         res.status(201).json(savedOrder);
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }

// };

export const genOTP = async (req, res) => {
    try {
        const { buyerId, items } = req.body;

        if (!buyerId || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Invalid request. Provide buyerId and items array." });
        }

        // Fetch full product details
        const products = await Product.find({ _id: { $in: items } });

        if (products.length !== items.length) {
            return res.status(400).json({ message: "Some products were not found." });
        }

        // Create separate orders for each product with full details
        const orderPromises = products.map(async (product) => {
            const otp = generateOTP();
            const newOrder = new Order({
                buyerId,
                sellerId: product.sellerId,
                object: {  // Embed product details
                    _id: product._id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    imageUrl: product.imageUrl
                },
                otp
            });
            return newOrder.save();
        });

        const savedOrders = await Promise.all(orderPromises);
        res.status(201).json({ message: "Orders placed successfully!", orders: savedOrders });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Verify OTP and Complete Transaction
// export const verifyOTP = async (req, res) => {
//     app.post("/verify-otp", async (req, res) => {
//         const { orderId, enteredOtp } = req.body;
    
//         // Fetch order from database
//         const order = await Order.findById(orderId);
//         if (!order) return res.status(404).json({ message: "Order not found" });
    
//         // Compare entered OTP with stored hashed OTP
//         const isMatch = await bcrypt.compare(enteredOtp, order.hashedOtp);
//         if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });
    
//         // Update order status to "Delivered"
//         order.status = "Delivered";
//         await order.save();
    
//         res.json({ message: "Order delivered successfully!" });
//     });
// };

// export const verifyOTP = async(req,res) =>{
//     const { orderId, itemId } = req.params;
//     const { otp } = req.body;
  
//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  
//     // Find the specific item inside the order
//     const item = order.items.find((i) => i._id.toString() === itemId);
//     if (!item) return res.status(404).json({ success: false, message: "Item not found" });
  
//     // Compare the entered OTP with the hashed OTP stored in the database
//     const isMatch = compareHash(otp, item.otp);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }
  
//     // Update item status to Delivered
//     // item.status = "Delivered";
    // await Product.findByIdAndUpdate(item.productId, { status: "Delivered" });
//     await order.save();
  
//     res.json({ success: true, message: "Product delivered successfully" });
//   };
  

  
export const verifyOTP = async(req,res) =>{
    // console.log("Here!!");
    const { productId, otp } = req.body;
  
    const order = await Order.findOne({ "items.productId": productId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
  
    const item = order.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Product not found in order" });
    }
  
    const isValid = bcrypt.compareSync(otp,item.otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  
    await Product.findByIdAndUpdate(item.productId, { status: "Delivered" });

    await order.save();
  
    res.json({ success: true, message: "OTP verified, product delivered." });
}
  
