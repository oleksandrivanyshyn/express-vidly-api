import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  afterAll,
} from '@jest/globals';
import request from 'supertest';
import { Genre } from '../../models/genre.js';
import { User } from '../../models/user.js';
import mongoose from 'mongoose';

let server: any;

describe('/api/genres integration', () => {
  beforeEach(async () => {
    const module = await import('../../../src/server.js');
    server = module.default;
  });

  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' },
      ]);

      const res = await request(server).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g: any) => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some((g: any) => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    });

    it('should return 400 if invalid id format is passed', async () => {
      const res = await request(server).get('/api/genres/1');
      expect(res.status).toBe(400);
    });

    it('should return 404 if no genre with the given id exists', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get('/api/genres/' + id);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let token: string;
    let name: string;

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 5 characters', async () => {
      name = '1234';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () => {
      await exec();
      const genre = await Genre.find({ name: 'genre1' });
      expect(genre).not.toBeNull();
      expect(genre.length).toBe(1);
    });

    it('should return the genre if it is valid (201 Created)', async () => {
      const res = await exec();
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });

  describe('PUT /:id', () => {
    let token: string;
    let newName: string;
    let genre: any;
    let id: string;

    const exec = async () => {
      return await request(server)
        .put('/api/genres/' + id)
        .set('x-auth-token', token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      genre = new Genre({ name: 'genre1' });
      await genre.save();

      token = new User().generateAuthToken();
      id = genre._id.toHexString();
      newName = 'updatedName';
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 5 characters', async () => {
      newName = '1234';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if id is invalid format', async () => {
      id = '1';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 404 if genre with the given id was not found', async () => {
      id = new mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should update the genre if input is valid', async () => {
      await exec();
      const updatedGenre = await Genre.findById(genre._id);
      expect(updatedGenre?.name).toBe(newName);
    });

    it('should return the updated genre if it is valid', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
    });
  });

  describe('DELETE /:id', () => {
    let token: string;
    let genre: any;
    let id: string;

    const exec = async () => {
      return await request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token)
        .send();
    };

    beforeEach(async () => {
      genre = new Genre({ name: 'genre1' });
      await genre.save();

      id = genre._id.toHexString();
      token = new User({ isAdmin: true } as any).generateAuthToken();
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false } as any).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it('should return 400 if id is invalid format', async () => {
      id = '1';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 404 if no genre with the given id was found', async () => {
      id = new mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should delete the genre if input is valid', async () => {
      await exec();
      const genreInDb = await Genre.findById(id);
      expect(genreInDb).toBeNull();
    });

    it('should return the removed genre', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id', genre._id.toHexString());
      expect(res.body).toHaveProperty('name', genre.name);
    });
  });
});
