import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// --- SUB-DOCUMENT SCHEMA for the Cart ---
// This defines the structure of ONE item inside the user's cart array
const cartItemSchema = new mongoose.Schema({
  // We link the product using its unique MongoDB ID
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Item', // This tells Mongoose to reference the 'Item' model we just made
  },
  name: {
    // We duplicate the name and image here so we don't have to
    // populate/lookup the Item model every time we just want to display the cart.
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});


// --- MAIN USER SCHEMA ---
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // No two users can share an email
    },
    password: {
      type: String,
      required: true,
      select: false, // IMPORTANT: This prevents the password from being sent back
                    // in API responses by default.
    },
    // We embed the cart schema right here
    cart: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

// --- Mongoose Middleware (pre-save hook) ---
// This function will automatically run RIGHT BEFORE a user is 'save()'d to the DB.
// We use this to hash the password if it has been modified.
userSchema.pre('save', async function (next) {
  // 'this' refers to the user document about to be saved

  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next(); // If password hasn't changed, skip hashing and move on
  }

  // Generate a 'salt' (random characters) to mix with the password
  const salt = await bcrypt.genSalt(10); // 10 rounds is standard
  // Re-assign the user's password to the new, hashed version
  this.password = await bcrypt.hash(this.password, salt);
});

// --- Schema Method (Password Matching) ---
// We add a custom method to our schema called 'matchPassword'.
// This lets us check 'user.matchPassword(enteredPassword)' in our login route.
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' refers to the hashed password stored in the DB (which we must 'select' during login)
  return await bcrypt.compare(enteredPassword, this.password);
};


// Create the final model
const User = mongoose.model('User', userSchema);

export default User;