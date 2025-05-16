import mongoose from "mongoose";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Product from "../models/product.js";

// export const loginUser = async(req,res)=>{
//     try {
//         const { email, password } = req.body;
    
//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//           return res.status(400).json({ msg: 'Invalid credentials' });
//         }
    
//         // Compare the entered password with the stored hashed password
//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) {
//           return res.status(400).json({ msg: 'Invalid credentials' });
//         }
    
//         // Create a JWT token
//         const token = jwt.sign({ userId: user._id }, 'your_jwt_secret_key', { expiresIn: '1h' });
    
//         res.status(200).json({ msg: 'Login successful', token });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: 'Server error' });
//       }
// }
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, age, contactNumber, password } = req.body;

    if (!firstName || !lastName || !email || !age || !contactNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ firstName, lastName, email, age, contactNumber, password });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login Attempt');

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    console.log("User found:", email);

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Incorrect password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Password correct!!");

    // Send user data without password
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserProfile=async(req,res)=>{
  try {
    const user = await User.findById(req.user._id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}


// ✅ PUT update user profile
export const postUserProfile=async(req,res)=>{
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update allowed fields (excluding email)
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.age = req.body.age || user.age;
    user.contactNumber = req.body.contactNumber || user.contactNumber;

    await user.save();
    res.json({ message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};


export const addtoCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Ensure valid ObjectId
    // if (!ObjectId.isValid(userId) || !ObjectId.isValid(productId)) {
    //   return res.status(400).json({ error: 'Invalid ID(s)' });
    // }

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ error: 'User or Product not found' });
    }
    console.log("User ID, productId from frontend:",userId, productId);
    if (!user.user_cart) {
      user.user_cart = [];
    }

    if(userId == product.sellerId){
      return res.json({message:'Buyer and Seller both  are same!!!'});
    }
    // Check if product is already in the cart
    if (!user.user_cart.includes(productId)) {
      console.log("adding to cart!!!");
      user.user_cart.push(productId);
      await user.save();
    }

    return res.status(200).json({ message: 'Product added to cart', cart: user.user_cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};


export const getCartItems = async (req, res) => {
  try {
    // console.log("Came to getcart!!");
    const { user_id } = req.params;
    console.log("user id: ",user_id);

    // Find user and get their cart (array of product ObjectIds)
    const user = await User.findById(user_id).populate("user_cart");
    console.log("user items? ",user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(user.user_cart);
    res.json(user.user_cart);  // Send full product details
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removefromCart = async (req, res) => {
  const { userId, productId } = req.body; // Get userId and productId from request body
  console.log("user id: ",userId);
  console.log("product id: ",productId);
  try {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { user_cart: productId } },
      { new: true }
      // console.log("1");
    );
    // await Product.findByIdAndUpdate(productId, { status: "Available" });

    res.status(200).send("Item removed from cart");
  } catch (err) {
    res.status(500).send("Error removing item from cart");
  }
};
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log('Xame');
//     const user = await User.findOne({ email });
//     console.log("from Backend",email,password, user);
//     // Compare the entered password with the hashed password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//         return res.status(400).json({ message: "Invalid credentials" });
//     }
//     console.log("Password correct!!");
//     if (user) {
//       res.json({
//         _id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(401).json({ message: "Invalid email or password" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };