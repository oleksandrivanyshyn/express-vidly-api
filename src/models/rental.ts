import Joi from 'joi';
import moment from 'moment';
import {
  Schema,
  model,
  Document,
  Model,
  type HydratedDocument,
} from 'mongoose';

export interface IRental extends Document {
  customer: {
    _id: string;
    name: string;
    isGold: boolean;
    phone: string;
  };
  movie: {
    _id: string;
    title: string;
    dailyRentalRate: number;
  };
  dateOut: Date;
  dateReturned?: Date;
  rentalFee?: number;
}

export interface IRentalMethods {
  return(): void;
}

export interface IRentalModel extends Model<IRental, {}, IRentalMethods> {
  lookup(
    customerId: string,
    movieId: string,
  ): Promise<HydratedDocument<IRental, IRentalMethods> | null>;
}

export interface RentalInput {
  customerId: string;
  movieId: string;
}

const rentalSchema = new Schema<IRental, IRentalModel, IRentalMethods>({
  customer: {
    type: new Schema({
      name: { type: String, required: true, minlength: 5, maxlength: 50 },
      isGold: { type: Boolean, default: false },
      phone: { type: String, required: true, minlength: 5, maxlength: 50 },
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
      dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
    }),
    required: true,
  },
  dateOut: { type: Date, required: true, default: Date.now },
  dateReturned: { type: Date },
  rentalFee: { type: Number, min: 0 },
});

rentalSchema.methods.return = function (
  this: HydratedDocument<IRental, IRentalMethods>,
) {
  this.dateReturned = new Date();
  const daysOut = moment().diff(moment(this.dateOut), 'days');
  this.rentalFee = daysOut * this.movie.dailyRentalRate;
};

rentalSchema.statics.lookup = function (
  customerId: string,
  movieId: string,
): Promise<HydratedDocument<IRental, IRentalMethods> | null> {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId,
  });
};

export const Rental = model<IRental, IRentalModel>('Rental', rentalSchema);

export function validateRental(rental: RentalInput) {
  const schema = Joi.object<RentalInput>({
    customerId: Joi.string().hex().length(24).required(),
    movieId: Joi.string().hex().length(24).required(),
  });

  return schema.validate(rental);
}
