import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema=new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true 
    },
    age:{
        type:Number,
        required: true
    },
    contactNumber:{
        type:String,
        required: true 
    },
    password:{
        type: String,
        required: true,
        // minlenght: 6
    },
    user_cart:[{
        type: mongoose.Schema.Types.ObjectId, ref:"Product",
    }],
    // sellerReviews:[{
    //     type:String
    // }],
});

// Hash the password before saving to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next(); // Skip hashing if password hasn't been modified
    }
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt); // Hash the password
      next();
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
});

// Method to compare input password with stored hashed password
userSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password); // Compare passwords
  };


const User=mongoose.model("User", userSchema);
export default User;