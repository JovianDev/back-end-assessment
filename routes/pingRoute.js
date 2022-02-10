import express from 'express';

import { pingController } from '../controllers/pingController.js';

const router = express.Router();

router.get('/', [pingController.ping], (req, res) => {
  res.status(200).send(res.locals.ping).end();
});
export default router;
