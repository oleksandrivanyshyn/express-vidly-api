import { Router } from 'express';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Genre, validateGenre, type GenreInput } from '../models/genre.js';

const router = Router();

router.get('/', async (_: Request, res: Response) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(String(req.params.id!)))
    return res.status(400).send('Invalid ID.');

  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.post('/', async (req: Request<{}, {}, GenreInput>, res: Response) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0]?.message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.status(201).send(genre);
});

router.put(
  '/:id',
  async (req: Request<{ id: string }, {}, GenreInput>, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(String(req.params.id!)))
      return res.status(400).send('Invalid ID.');

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0]?.message);

    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { returnDocument: 'after' },
    );

    if (!genre)
      return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
  },
);

router.delete('/:id', async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(String(req.params.id!)))
    return res.status(400).send('Invalid ID.');

  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

export default router;
