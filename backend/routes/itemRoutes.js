import express from 'express';
const router = express.Router();
import {
  getItems,
  getItemById,
  createItem,
} from '../controllers/itemController.js';

// Chain the GET (all) and POST (create) routes that point to the same URL '/'
router.route('/')
  .get(getItems)
  .post(createItem);

// Route for a single item by ID
router.route('/:id')
  .get(getItemById);

export default router;