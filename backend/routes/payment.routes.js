import express from "express";
import dotenv from "dotenv";
import { verifyToken } from "../middleware/auth.js";
import axios from "axios";
import { User } from "../models/User.model.js";

dotenv.config();

const router = express.Router();

const TEST_ENDPOINT = "https://sandbox.cashfree.com/pg";
const PROD_ENDPOINT = "https://api.cashfree.com/pg";
const API_ENDPOINT = process.env.NODE_ENV === 'production' ? PROD_ENDPOINT : TEST_ENDPOINT;

router.post("/payment/create-order", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    const credits = req.body.credits || 0;

    const orderPayload = {
      order_id: orderId,
      order_amount: req.body.amount,
      order_currency: "INR",
      customer_details: {
        customer_id: user._id.toString(),
        customer_name: user.name || "Customer",
        customer_email: user.email,
        customer_phone: user.phone || "9999999999"
      },
      order_meta: {
        return_url: `https://voteplay.tech/payment-status?order_id=${orderId}&credits=${credits}`,
        notify_url: `https://voteplay-backend.onrender.com/api/payment/webhook`
      },
      order_note: `Credits: ${credits}`
    };

    console.log('Creating order with payload:', orderPayload);

    const response = await axios.post(
      `${API_ENDPOINT}/orders`, 
      orderPayload,
      {
        headers: {
          'x-client-id': process.env.CASHFREE_APP_ID,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY,
          'x-api-version': '2022-09-01',
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      order_id: response.data.order_id,
      payment_session_id: response.data.payment_session_id,
      credits: credits
    });

  } catch (error) {
    console.error("Order creation error:", error.response?.data || error.message);
    res.status(500).json({ 
      success: false,
      message: "Failed to create payment order",
      error: error.response?.data || error.message 
    });
  }
});

router.get("/payment/verify/:orderId", verifyToken, async (req, res) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINT}/orders/${req.params.orderId}`,
      {
        headers: {
          'x-client-id': process.env.CASHFREE_APP_ID,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY,
          'x-api-version': '2022-09-01'
        }
      }
    );

    if (response.data.order_status === 'PAID') {
      res.json({
        success: true,
        status: 'PAID'
      });
    } else {
      res.json({
        success: false,
        status: response.data.order_status
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment"
    });
  }
});

export default router;
