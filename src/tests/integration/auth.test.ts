import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import { User } from '../../models/user.js';
import { Genre } from '../../models/genre.js';
let server: any;

describe('auth middleware integration', () => {
  beforeEach(async () => {
    const module = await import('../../server.js');
    server = module.default;
  });

  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
  });

  let token: string;

  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 201 if token is valid', async () => {
    const res = await exec();
    expect(res.status).toBe(201);
  });
});
