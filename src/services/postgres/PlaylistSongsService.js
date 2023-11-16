const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSong(playlistId, songId) {
    const id = `playlistSong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3)',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    await this._cacheService.delete(`playlistSongs:${playlistId}`);
  }

  async getSongsByPlaylistId(playlistId) {
    try {
      const result = await this._cacheService.get(`playlistSongs:${playlistId}`);
      return {
        songs: JSON.parse(result),
        source: 'cache',
      };
    } catch (error) {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer
                FROM playlist_songs
                LEFT JOIN songs ON playlist_songs.song_id = songs.id
                WHERE playlist_songs.playlist_id = $1
        `,
        values: [playlistId],
      };

      const result = await this._pool.query(query);
      await this._cacheService.set(`playlistSongs:${playlistId}`, JSON.stringify(result.rows));

      return {
        songs: result.rows,
        source: 'database',
      };
    }
  }

  async deleteSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id =$2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus dari playlist. Data tidak ditemukan');
    }

    await this._cacheService.delete(`playlistSongs:${playlistId}`);
  }
}

module.exports = PlaylistSongsService;
