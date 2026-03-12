import Joi from 'joi';
import { Schema, model, Document } from 'mongoose';

export interface IGenre extends Document {
  name: string;
}

export interface GenreInput {
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

export const Genre = model<IGenre>('Genre', genreSchema);

export function validateGenre(genre: GenreInput) {
  const schema = Joi.object<GenreInput>({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genre);
}
