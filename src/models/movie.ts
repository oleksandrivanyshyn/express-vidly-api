import Joi from 'joi';
import { Schema, model, Document } from 'mongoose';
import { genreSchema, type IGenre } from './genre.js';

export interface IMovie extends Document {
  title: string;
  genre: IGenre;
  numberInStock: number;
  dailyRentalRate: number;
}

export interface MovieInput {
  title: string;
  genreId: string;
  numberInStock: number;
  dailyRentalRate: number;
}

const movieSchema = new Schema<IMovie>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

export const Movie = model<IMovie>('Movie', movieSchema);

export function validateMovie(movie: MovieInput) {
  const schema = Joi.object<MovieInput>({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().hex().length(24).required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return schema.validate(movie);
}
