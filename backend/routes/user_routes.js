// import express from "express";     //express used to create a server and handle routes.
import bcrypt from "bcrypt";        //bcrypt is a library used for hashing passwords before storing them in the database to enhance security.
import jwt from "jsonwebtoken";      //jsonwebtoken is typically used for user authentication 
import express from "express";
import { getUserProfile, loginUser, registerUser, postUserProfile ,addtoCart, getCartItems, removefromCart} from "../controllers/user.controllers.js";
import {protect} from "../middleware/authMiddleware.js";

const router=express.Router();        // router helps in modularity of the code, as it defines and manages routes separately from the main srever file.// here, a new router instance is created using express.router(), which is like a mini version of express app that can hanfle routes separately.

router.post("/login",loginUser);

router.post("/register", registerUser);

//myprofile page
router.get("/profile", protect, getUserProfile);

//edit myprofile page
router.put("/profile", protect, postUserProfile);

//add to cart on home page
router.post("/add-to-cart", addtoCart);

//mycart page
router.get("/cart/:user_id", getCartItems);

//delete an item from mycart i.e. deleting that object id from users schema user_cart srray.
router.delete("/cart/remove", removefromCart);

export default router;