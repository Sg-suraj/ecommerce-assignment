import jwt from 'jsonwebtoken';

// This function generates the token.
// It takes the user's ID as the payload (the data we want to store in the token)
const generateToken = (res, userId) => {
  const token = jwt.sign(
    { userId: userId }, // The data payload
    process.env.JWT_SECRET, // The secret key from our .env file
    {
      expiresIn: '30d', // We set the token to expire in 30 days
    }
  );

  // We are returning the token AND setting it as an HTTP-Only cookie
  // This is a more secure way than storing it in localStorage on the frontend
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });

  return token;
};

export default generateToken;