import { Router } from 'express';
import type { Request, Response } from 'express';
import { Genre, validateGenre, type GenreInput } from '../models/genre.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = Router();

router.get('/', async (_: Request, res: Response) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', validateObjectId, async (req: Request, res: Response) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.post(
  '/',
  auth,
  async (req: Request<{}, {}, GenreInput>, res: Response) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0]?.message);

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    res.status(201).send(genre);
  },
);

router.put(
  '/:id',
  [auth, validateObjectId],
  async (req: Request<{ id: string }, {}, GenreInput>, res: Response) => {
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

router.delete(
  '/:id',
  [auth, admin, validateObjectId],
  async (req: Request, res: Response) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre)
      return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
  },
);

export default router;
