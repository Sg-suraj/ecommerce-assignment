import Item from '../models/itemModel.js';

// @desc    Get all items WITH filtering
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    // We build our filter object based on the query parameters sent in the URL
    // e.g., /api/items?category=Electronics&maxPrice=500
    
    const { category, minPrice, maxPrice } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    // Check for price filtering
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice); // $gte = Greater than or equal to
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice); // $lte = Less than or equal to
      }
    }

    // Find all items that match the built filter
    const items = await Item.find(filter);
    
    res.status(200).json(items);

  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};


// @desc    Get a single item by its ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      return res.json(item);
    } else {
      res.status(404);
      throw new Error('Item not found');
    }
  } catch (error) {
     res.status(404).json({ message: 'Item not found' });
  }
};


// @desc    Create a new item (for testing/populating DB)
// @route   POST /api/items
// @access  Public (we would normally protect this, but keeping it simple for the assignment)
const createItem = async (req, res) => {
  try {
    // Get all data needed from the request body
    const { name, description, price, category, imageUrl, countInStock } = req.body;

    const newItem = new Item({
      name,
      description,
      price: Number(price),
      category,
      imageUrl: imageUrl || '/images/sample.jpg', // Default image if none provided
      countInStock: Number(countInStock),
    });

    const createdItem = await newItem.save();
    res.status(201).json(createdItem);

  } catch (error) {
    res.status(400).json({ message: 'Error creating item: ' + error.message });
  }
};

export { getItems, getItemById, createItem };