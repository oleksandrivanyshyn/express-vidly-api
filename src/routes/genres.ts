import { Router } from 'express';
import type { Request, Response } from 'express';
import Joi from 'joi';
import mongoose, { Schema, model, Document } from 'mongoose';

interface IGenre extends Document {
  name: string;
}

interface GenreInput {
  name: string;
}

const genreSchema = new Schema<IGenre>({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = model<IGenre>('Genre', genreSchema);

const router = Router();

router.get('/', async (_: Request, res: Response) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
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

router.get('/:id', async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(String(req.params.id!)))
    return res.status(400).send('Invalid ID.');

  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

function validateGenre(genre: GenreInput) {
  const schema = Joi.object<GenreInput>({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genre);
}

export default router;
