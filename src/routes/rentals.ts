import { Router } from 'express';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Rental, validateRental, type RentalInput } from '../models/rental.js';
import { Movie } from '../models/movie.js';
import { Customer } from '../models/customer.js';

const router = Router();

router.get('/', async (_: Request, res: Response) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req: Request<{}, {}, RentalInput>, res: Response) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0]?.message);

  if (!mongoose.Types.ObjectId.isValid(String(req.body.customerId)))
    return res.status(400).send('Invalid Customer ID format.');
  if (!mongoose.Types.ObjectId.isValid(String(req.body.movieId)))
    return res.status(400).send('Invalid Movie ID format.');

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock.');

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await rental.save({ session });

    movie.numberInStock--;
    await movie.save({ session });

    await session.commitTransaction();

    res.status(201).send(rental);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).send('Something failed during transaction.');
  } finally {
    session.endSession();
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(String(req.params.id!)))
    return res.status(400).send('Invalid ID.');

  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

export default router;
