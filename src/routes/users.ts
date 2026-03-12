import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import { User, validateUser } from '../models/user.js';
import auth from '../middlewares/auth.js';
import type { AuthRequest } from '../middlewares/auth.js';

const router = Router();

router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id).select('-password');
  if (!user) {
    return res.status(404).send('The user was not found.');
  }
  res.send(user);
});

router.post('/', async (req: Request, res: Response) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0]?.message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res
    .header('x-auth-token', token)
    .status(201)
    .send(_.pick(user, ['_id', 'name', 'email']));
});

export default router;
