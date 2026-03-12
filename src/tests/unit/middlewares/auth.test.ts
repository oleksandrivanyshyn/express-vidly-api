import type { AuthRequest } from '../../../middlewares/auth.js';
import auth from '../../../middlewares/auth.js';
import { User } from '../../../models/user.js';
import mongoose from 'mongoose';
import type { Response, NextFunction } from 'express';
import { jest, describe, it, expect } from '@jest/globals';

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    process.env.JWT_PRIVATE_KEY = 'testSecretKey123';

    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };

    const token = new User(user).generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token),
    } as unknown as AuthRequest;

    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
    expect(next).toHaveBeenCalled();
  });
});
