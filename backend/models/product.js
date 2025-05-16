import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    price:{
        type:Number,
        required: true 
    },
    
    image:{
        type:String,
        required: true
    },
    status:{
        type: String,
        default: "Available"
    },

    category:{
        type: String,
        required: true 
    },
    description:{
        type: String,
        required: true 
    },
    sellerId: {  // New field to store the seller's ID
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        // required: true
    }
    
},{
    timestamps: true //createdAT, UpdatedAT
}
);

const Product= mongoose.model('Product', productSchema);
//mongoose will automatically make it lowercase and plural i.e. products. Hence, we will use product so that it makes it products, if we will use products it will make it productss.
//product will be the name of collection mongoose will make, or automatically connect to if one like this already exist.

export default Product;