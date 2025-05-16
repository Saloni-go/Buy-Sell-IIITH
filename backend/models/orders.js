import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    buyerId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', 
        required: true 
    }, // Buyer ID

    // sellerId: { 
    //     type: mongoose.Schema.Types.ObjectId, ref: 'User', 
    //     required: true 
    // }, // Seller ID

    // items: {
    //   type: mongoose.Schema.Types.ObjectId, 
    //   ref: 'Product', 
    //   required: true 
    // }, // Array of product IDs

    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            otp: { type: String, required: true } // Hashed OTP
        }
    ],

    // otp: { 
    //     type: String, 
    //     required: true 
    // }, // OTP for order verification

    status: { 
        type: String, 
        default: 'Pending' 
    } // Order status (Pending, Completed, Cancelled)
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
