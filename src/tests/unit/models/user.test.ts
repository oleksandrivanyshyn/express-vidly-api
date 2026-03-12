import { User } from '../../../models/user.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

describe('user.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    process.env.JWT_PRIVATE_KEY = 'testSecretKey123';

    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };

    const user = new User(payload);

    const token = user.generateAuthToken();

    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY) as any;

    expect(decoded).toMatchObject(payload);
  });
});
