const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async add({
    playlistId, songId, userId, action,
  }) {
    const id = `activities-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Log aktivitas gagal ditambahkan');
    }
  }

  async get(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
              FROM playlist_song_activities
              LEFT JOIN playlists ON playlists.id = playlist_song_activities.playlist_id
              LEFT JOIN users ON playlists.owner = users.id
              LEFT JOIN songs ON songs.id = playlist_song_activities.song_id
              WHERE playlist_song_activities.playlist_id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistSongActivitiesService;
