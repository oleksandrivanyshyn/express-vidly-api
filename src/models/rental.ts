import Joi from 'joi';
import { Schema, model, Document } from 'mongoose';

export interface IRental extends Document {
  customer: {
    name: string;
    isGold: boolean;
    phone: string;
  };
  movie: {
    title: string;
    dailyRentalRate: number;
  };
  dateOut: Date;
  dateReturned?: Date;
  rentalFee?: number;
}

export interface RentalInput {
  customerId: string;
  movieId: string;
}

const rentalSchema = new Schema<IRental>({
  customer: {
    type: new Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

export const Rental = model<IRental>('Rental', rentalSchema);

export function validateRental(rental: RentalInput) {
  const schema = Joi.object<RentalInput>({
    customerId: Joi.string().hex().length(24).required(),
    movieId: Joi.string().hex().length(24).required(),
  });

  return schema.validate(rental);
}
