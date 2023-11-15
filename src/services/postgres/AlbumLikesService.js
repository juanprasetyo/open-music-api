const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor() {
    this._pool = new Pool();
  }

  async add(userId, albumId) {
    const id = `albumLike-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3)',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menyukai album');
    }
  }

  async getTotalLikes(albumId) {
    const query = {
      text: 'SELECT COUNT(id) AS likes FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return parseInt(result.rows[0].likes, 10);
  }

  async delete(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal batal menyukai album. Data tidak ditemukan');
    }
  }

  async verifyUserLikedBefore(userId, albumId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError('Anda telah menyukai album ini sebelumnya');
    }
  }
}

module.exports = AlbumLikesService;
