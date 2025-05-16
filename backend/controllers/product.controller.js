import mongoose from "mongoose";
import Product from "../models/product.js";

export const createProducts=async(req,res)=>{
    //defines a route that listens for post requests at the /products endpoint
    const product=req.body;
    //req.body is the data sent by the client in the request body (As JSON)
    //eg.{ name: "Laptop", price: 1500, image: "laptop.jpg" }

    // if(!product.name || !product.price || !product.image || product.description || product.category){
    //     return res.status(400).json({success:false, message:"Please provide all fields"});
    // }

    const newProduct=new Product(product) //product from above, were we requested client's input into it
    //this we will put into database now

    try{
        await newProduct.save();
        // saves newly created product document to the database.
        res.status(201).json({success: true, data: newProduct});
        // data: new product means it Sends the saved product (including its _id assigned by MongoDB) back to the client as confirmation.

    }
    catch(error){
        console.error("Error in create product: ", error.message);
        res.status(500).json({success:false, message:"Server error"});
    }
};

export const getProducts=async(req,res)=>{
    try{

        
        const products = await Product.find({status: "Available" });
        res.status(200).json({success: true, data: products});
    }
    catch(error){
        console.log("error in fetching prodcuts: ",error.message); //just for debugging purposes, we should see it in terminal. 
        res.status(500).json({success: false, message: "Server Error"});
    }
};

export const deleteProducts=async(req,res) => {
    const {id} = req.params;
    // console.log("id:", id);

    try{
        await Product.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Successfully deleted"});

    }
    catch(error){
        // console.log("Error in deleting the product:", error.message);
        res.status(404).json({success: false, message:"Product not found"});
    }
};

export const updateProducts = async (req, res) => {
    const {id} = req.params;
    const product = req.body;

    // Validate product fields before updating
    if (!product.name && !product.price && !product.image && !product.description && !product.category) {
        return res.status(400).json({
            success: false,
            message: "At least one field (name, price, or image) must be provided for the update"
        });
    }

    try {
        // Attempt to update the product by its ID
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });

        if (!updatedProduct) {
            // If no product was found and updated
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Successfully updated product
        res.status(200).json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        // Catch errors and send server error response
        console.error("Error in updating product:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


export const getAproduct= async (req, res) => {
    const productId = req.params.id;

    try {
      // Find the product by ID
      const product = await Product.findById(productId);
      
      if (!product) {
        // If no product is found, send a 404 response
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // If product is found, return it in the response
      res.json(product);
    } catch (error) {
      console.error(error);
      // If an error occurs, send a 500 server error response
      res.status(500).json({ message: 'Server Error' });
    }
  };
  