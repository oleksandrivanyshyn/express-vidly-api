import Joi from 'joi';
import { Schema, model, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  isGold: boolean;
  phone: string;
}

export interface CustomerInput {
  name: string;
  isGold?: boolean;
  phone: string;
}

const customerSchema = new Schema<ICustomer>({
  name: {
    type: String,
    required: true,
    trim: true,
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
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
});

export const Customer = model<ICustomer>('Customer', customerSchema);

export function validateCustomer(customer: CustomerInput) {
  const schema = Joi.object<CustomerInput>({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}
