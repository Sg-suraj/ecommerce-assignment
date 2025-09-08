import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  getUserCart,
  addItemToCart,
  removeItemFromCart,
} from '../controllers/userController.js';

// Import our new middleware
import { protect } from '../middleware/authMiddleware.js';

// --- Public Routes (No token needed) ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Private Cart Routes (Token IS required) ---
// We apply the 'protect' middleware first. If the token is valid,
// it will then run the controller function (like getUserCart).
router.route('/cart')
  .get(protect, getUserCart)
  .post(protect, addItemToCart);

// Route for removing a specific item (needs ID)
router.route('/cart/:productId')
  .delete(protect, removeItemFromCart);


export default router;