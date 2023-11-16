const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
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

    await this._cacheService.delete(`albumLikes:${albumId}`);
  }

  async getTotalLikes(albumId) {
    try {
      const result = await this._cacheService.get(`albumLikes:${albumId}`);
      return {
        likes: JSON.parse(result),
        source: 'cache',
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(id) AS likes FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likes = parseInt(result.rows[0].likes, 10);

      await this._cacheService.set(`albumLikes:${albumId}`, JSON.stringify(likes));
      return {
        likes,
        source: 'database',
      };
    }
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

    await this._cacheService.delete(`albumLikes:${albumId}`);
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
