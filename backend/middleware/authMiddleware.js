import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Import the User model
import asyncHandler from "express-async-handler"; // Middleware to handle async errors

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the request has an Authorization header and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from the Authorization header (Bearer TOKEN_VALUE)
      token = req.headers.authorization.split(" ")[1];

      // Decode and verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the decoded user ID and exclude the password
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Not Authorized, token failed:", error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // If no token is found, return an unauthorized error
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
