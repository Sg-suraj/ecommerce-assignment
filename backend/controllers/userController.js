import User from '../models/userModel.js';
import Item from '../models/itemModel.js'; // We need the Item model to look up product info
import generateToken from '../utils/generateToken.js';

// @desc    Register (sign up) a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, cart: [] });
    if (user) {
      const token = generateToken(res, user._id);
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        cart: user.cart,
        token: token,
      });
    }
  } catch (error) {
    return res.status(400).json({ message: 'Invalid user data: ' + error.message });
  }
};


// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email }).select('+password');
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(res, user._id);
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        cart: user.cart,
        token: token,
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// ==== START NEW CART FUNCTIONS ====

// @desc    Get the user's cart
// @route   GET /api/users/cart
// @access  PRIVATE (Requires login)
const getUserCart = async (req, res) => {
  // Because we used the 'protect' middleware, we automatically
  // have the logged-in user available as 'req.user'.
  // We already fetched the user (and their cart) in the middleware.
  res.status(200).json(req.user.cart);
};


// @desc    Add an item to the user's cart
// @route   POST /api/users/cart
// @access  PRIVATE
const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const user = req.user; // Get the logged-in user from the 'protect' middleware

  try {
    // 1. Find the item the user is trying to add, to make sure it exists
    const itemToAdd = await Item.findById(productId);
    if (!itemToAdd) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // 2. Check if this item is ALREADY in the user's cart
    const existingCartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingCartItem) {
      // 3. If it is, just update the quantity
      existingCartItem.quantity += Number(quantity);
    } else {
      // 4. If it's not, create a new cart item object and add it to the array
      const newCartItem = {
        product: itemToAdd._id,
        name: itemToAdd.name,
        imageUrl: itemToAdd.imageUrl,
        price: itemToAdd.price,
        quantity: Number(quantity),
      };
      user.cart.push(newCartItem);
    }

    // 5. Save the updated user (with their updated cart) to the DB
    const updatedUser = await user.save();

    // 6. Send back the updated cart
    res.status(200).json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};


// @desc    Remove an item from the user's cart
// @route   DELETE /api/users/cart/:productId
// @access  PRIVATE
const removeItemFromCart = async (req, res) => {
  const user = req.user;
  const { productId } = req.params; // Get the product ID from the URL parameter

  try {
    // Filter the user's cart to create a new array that EXCLUDES the item we want to remove
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    // Save the user with the new, shorter cart array
    const updatedUser = await user.save();

    // Send back the updated cart
    res.status(200).json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};


// Export ALL functions
export {
  registerUser,
  loginUser,
  getUserCart,
  addItemToCart,
  removeItemFromCart,
};