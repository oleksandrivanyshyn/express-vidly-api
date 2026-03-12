import { Router } from 'express';
import type { Request, Response } from 'express';
import {
  Customer,
  validateCustomer,
  type CustomerInput,
} from '../models/customer.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = Router();

router.get('/', async (_: Request, res: Response) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', validateObjectId, async (req: Request, res: Response) => {
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
  validateObjectId,
  async (req: Request<{ id: string }, {}, CustomerInput>, res: Response) => {
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

router.delete('/:id', validateObjectId, async (req: Request, res: Response) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send('The customer with the given ID was not found.');

  res.send(customer);
});

export default router;
