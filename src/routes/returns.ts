import { Router } from 'express';
import type { Request, Response } from 'express';
import auth from '../middlewares/auth.js';
import { Rental } from '../models/rental.js';
import { Movie } from '../models/movie.js';

const router = Router();

router.post('/', auth, async (req: Request, res: Response) => {
  if (!req.body.customerId)
    return res.status(400).send('customerId not provided');
  if (!req.body.movieId) return res.status(400).send('movieId not provided');

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('Rental not found.');
  if (rental.dateReturned)
    return res.status(400).send('Return already processed.');

  rental.return();
  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } },
  );

  res.status(200).send(rental);
});

export default router;
