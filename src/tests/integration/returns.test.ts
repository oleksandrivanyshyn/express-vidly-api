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
import moment from 'moment';
import { Rental } from '../../models/rental.js';
import { Movie } from '../../models/movie.js';
import { User } from '../../models/user.js';
import { Genre } from '../../models/genre.js';

describe('/api/returns integration', () => {
  let server: any;
  let customerId: mongoose.Types.ObjectId;
  let movieId: mongoose.Types.ObjectId;
  let token: string;
  let rental: InstanceType<typeof Rental>;
  let movie: InstanceType<typeof Movie>;

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({
        customerId: customerId.toHexString(),
        movieId: movieId.toHexString(),
      });
  };

  beforeEach(async () => {
    const module = await import('../../../src/server.js');
    server = module.default;

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    const genre = new Genre({ name: 'Action' });

    movie = new Movie({
      _id: movieId,
      title: 'movie12345',
      genre,
      numberInStock: 10,
      dailyRentalRate: 2,
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: 'customer1',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: 'movie12345',
        dailyRentalRate: 2,
      },
      dateOut: moment().subtract(7, 'days').toDate(),
    });
    await rental.save();
  });

  afterEach(async () => {
    await Rental.deleteMany({});
    await Movie.deleteMany({});
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
    const res = await request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ movieId: movieId.toHexString() });
    expect(res.status).toBe(400);
  });

  it('should return 400 if movieId is not provided', async () => {
    const res = await request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId: customerId.toHexString() });
    expect(res.status).toBe(400);
  });

  it('should return 404 if no rental found for this customer/movie', async () => {
    await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it('should return 400 if rental is already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 200 on a valid request', async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it('should set dateReturned on a valid request', async () => {
    await exec();

    const updatedRental = await Rental.findById(rental._id);
    const diff = new Date().getTime() - updatedRental!.dateReturned!.getTime();
    expect(diff).toBeLessThan(10 * 1000);
  });

  it('should set rentalFee for a 7-day rental', async () => {
    await exec();

    const updatedRental = await Rental.findById(rental._id);
    expect(updatedRental!.rentalFee).toBe(14); // 7 days * $2/day
  });

  it('should increment the movie numberInStock by 1', async () => {
    await exec();

    const updatedMovie = await Movie.findById(movieId);
    expect(updatedMovie!.numberInStock).toBe(movie.numberInStock + 1);
  });

  it('should return the rental in the response body', async () => {
    const res = await exec();

    expect(res.body).toMatchObject({
      customer: expect.objectContaining({ name: 'customer1' }),
      movie: expect.objectContaining({ title: 'movie12345' }),
      dateReturned: expect.any(String),
      rentalFee: expect.any(Number),
    });
  });
});
