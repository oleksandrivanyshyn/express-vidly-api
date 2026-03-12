import { Router } from 'express';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Movie, validateMovie, type MovieInput } from '../models/movie.js';
import { Genre } from '../models/genre.js';

const router = Router();

router.get('/', async (_: Request, res: Response) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

router.post('/', async (req: Request<{}, {}, MovieInput>, res: Response) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0]?.message);

  if (!mongoose.Types.ObjectId.isValid(String(req.body.genreId)))
    return res.status(400).send('Invalid Genre ID format.');

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movie = await movie.save();

  res.status(201).send(movie);
});

router.put(
  '/:id',
  async (req: Request<{ id: string }, {}, MovieInput>, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(String(req.params.id!)))
      return res.status(400).send('Invalid Movie ID format.');

    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0]?.message);

    if (!mongoose.Types.ObjectId.isValid(String(req.body.genreId)))
      return res.status(400).send('Invalid Genre ID format.');

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
      { returnDocument: 'after' },
    );

    if (!movie)
      return res.status(404).send('The movie with the given ID was not found.');

    res.send(movie);
  },
);

router.delete('/:id', async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(String(req.params.id!)))
    return res.status(400).send('Invalid ID.');

  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

router.get('/:id', async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(String(req.params.id!)))
    return res.status(400).send('Invalid ID.');

  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

export default router;
