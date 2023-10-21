const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async add({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async get() {
    const result = await this._pool.query('SELECT * FROM songs');
    return result.rows.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));
  }

  async getById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0];
  }

  async getByAlbumId(albumId) {
    const query = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getByTitleAndPerformer(queryParameter) {
    const { title, performer } = queryParameter;

    const query = {
      text: "SELECT * FROM songs WHERE LOWER(title) LIKE LOWER('%' || $1 || '%') AND LOWER(performer) LIKE LOWER('%' || $2 || '%')",
      values: [title, performer],
    };

    const result = await this._pool.query(query);
    return result.rows.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));
  }

  async getByTitle(title) {
    const query = {
      text: "SELECT * FROM songs WHERE LOWER(title) LIKE LOWER('%' || $1 || '%')",
      values: [title],
    };

    const result = await this._pool.query(query);
    return result.rows.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));
  }

  async getByPerformer(performer) {
    const query = {
      text: "SELECT * FROM songs WHERE LOWER(performer) LIKE LOWER('%' || $1 || '%')",
      values: [performer],
    };

    const result = await this._pool.query(query);
    return result.rows.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));
  }

  async editById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongService;
