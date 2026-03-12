import { Router } from 'express';
import type { Request, Response } from 'express';
import Joi from 'joi';
import mongoose, { Schema, model, Document } from 'mongoose';

interface ICustomer extends Document {
  name: string;
  isGold: boolean;
  phone: string;
}

interface CustomerInput {
  name: string;
  isGold?: boolean;
  phone: string;
}

const customerSchema = new Schema<ICustomer>({
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
});

const Customer = model<ICustomer>('Customer', customerSchema);

const router = Router();

router.get('/', async (_: Request, res: Response) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(String(req.params.id!)))
    return res.status(400).send('Invalid ID.');

  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.send(customer);
});

router.post('/', async (req: Request<{}, {}, CustomerInput>, res: Response) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0]?.message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  customer = await customer.save();

  res.status(201).send(customer);
});

router.put(
  '/:id',
  async (req: Request<{ id: string }, {}, CustomerInput>, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(String(req.params.id!)))
      return res.status(400).send('Invalid ID.');

    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0]?.message);

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
      },
      { returnDocument: 'after' },
    );

    if (!customer)
      return res
        .status(404)
        .send('The customer with the given ID was not found.');

    res.send(customer);
  },
);

router.delete('/:id', async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(String(req.params.id!)))
    return res.status(400).send('Invalid ID.');

  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.send(customer);
});

function validateCustomer(customer: CustomerInput) {
  const schema = Joi.object<CustomerInput>({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

export default router;
