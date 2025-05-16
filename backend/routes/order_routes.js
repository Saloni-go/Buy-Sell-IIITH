import express from 'express';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const {verify} = jwt;

import {createOrder, genOTP, getHistory, verifyOTP, getSellerOrders} from "../controllers/order.controllers.js";


const router = express.Router();

// Generate OTP Function
router.post('/orders', genOTP);

// Verify OTP and Complete Transaction
router.post('/verify-otp', verifyOTP);

router.post('/create',createOrder);

router.get("/history/:userId", getHistory);

router.get("/seller/:sellerId", getSellerOrders);
console.log("1");

export default router;
