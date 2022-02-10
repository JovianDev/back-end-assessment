import express from 'express';
import { postsController } from '../controllers/postsController.js';

const router = express.Router();

router.get('/', [postsController.getPosts], (req, res) => {
  res.status(200).json(res.locals.posts).end();
});
export default router;
