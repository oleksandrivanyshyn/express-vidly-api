import { Router } from 'express';
import type { Request, Response } from 'express';
import Joi from 'joi';

interface Genre {
  id: number;
  name: string;
}

interface GenreInput {
  name: string;
}

const router = Router();

const genres: Genre[] = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Horror' },
  { id: 3, name: 'Romance' },
];

router.get('/', (_: Request, res: Response) => {
  res.send(genres);
});

router.get('/:id', (req: Request, res: Response) => {
  const genre = genres.find((g) => g.id === parseInt(String(req.params.id!)));
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

router.post('/', (req: Request<{}, {}, GenreInput>, res: Response) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0]?.message);

  const genre: Genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);
  res.status(201).send(genre);
});

router.put(
  '/:id',
  (req: Request<{ id: string }, {}, GenreInput>, res: Response) => {
    const genre = genres.find((g) => g.id === parseInt(String(req.params.id!)));
    if (!genre)
      return res.status(404).send('The genre with the given ID was not found.');

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0]?.message);

    genre.name = req.body.name;
    res.send(genre);
  },
);

router.delete('/:id', (req: Request, res: Response) => {
  const genre = genres.find((g) => g.id === parseInt(String(req.params.id!)));
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

function validateGenre(genre: GenreInput) {
  const schema = Joi.object<GenreInput>({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
}

export default router;
