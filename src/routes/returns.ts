import { Router } from 'express';
import type { Request, Response } from 'express';
import auth from '../middlewares/auth.js';
import { Rental } from '../models/rental.js';

const router = Router();

router.post('/', auth, async (req: Request, res: Response) => {
  if (!req.body.customerId)
    return res.status(400).send('customerId not provided');
  if (!req.body.movieId) return res.status(400).send('movieId not provided');

  const rental = await Rental.findOne({
    'customer._id': req.body.customerId,
    'movie._id': req.body.movieId,
  });

  if (!rental) return res.status(404).send('Rental not found.');
  if (rental.dateReturned)
    return res.status(400).send('Return already processed.');

  res.status(200).send();
});
export default router;
