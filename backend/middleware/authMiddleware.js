import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// This is the middleware function. We call it 'protect'.
const protect = async (req, res, next) => {
  let token;

  // 1. Read the JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // 2. Verify the token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user from the ID in the token payload
      // We attach this user to the request object (req.user)
      // so that all of our protected routes will have access to the logged-in user.
      // We exclude the password when fetching.
      req.user = await User.findById(decoded.userId).select('-password');

      // 4. Move on to the next function (the actual route controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // No token found at all
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };