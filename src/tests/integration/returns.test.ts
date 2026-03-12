import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  afterAll,
} from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { Rental } from '../../models/rental.js';
import { User } from '../../models/user.js';

describe('/api/returns integration', () => {
  let server: any;
  let customerId: string;
  let movieId: string;
  let token: string;

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    const module = await import('../../../src/server.js');
    server = module.default;

    customerId = new mongoose.Types.ObjectId().toHexString();
    movieId = new mongoose.Types.ObjectId().toHexString();
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await Rental.deleteMany({});
    await server.close();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 401 if client is not logged in', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('should return 400 if customerId is not provided', async () => {
    customerId = '';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 400 if movieId is not provided', async () => {
    movieId = '';
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it('should return 404 if no rental found for this customer/movie', async () => {
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it('should return 400 if rental is already processed', async () => {
    const rental = new Rental({
      customer: { _id: customerId, name: '12345', phone: '12345' },
      movie: { _id: movieId, title: '12345', dailyRentalRate: 2 },
      dateReturned: new Date(),
    });
    await rental.save();

    const res = await exec();
    expect(res.status).toBe(400);
  });
});
