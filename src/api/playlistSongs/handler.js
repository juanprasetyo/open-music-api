class PlaylistSongsHandler {
  constructor(playlistSongsService, playlistsService, songsService, validator) {
    this._playlistSongsService = playlistSongsService;
    this._playlistService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;
  }

  async post(request, h) {
    await this._validator.validatePlaylistSongPayload(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._songsService.getById(songId);
    await this._playlistService.verifyPlaylistAccess(playlistId, owner);
    await this._playlistSongsService.addSong(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam playlist',
    });
    response.code(201);
    return response;
  }

  async getById(request) {
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, owner);

    const playlist = await this._playlistService.getById(playlistId);
    const songs = await this._playlistSongsService.getSongsByPlaylistId(playlistId);

    delete playlist.owner;
    playlist.songs = songs;

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async delete(request) {
    await this._validator.validatePlaylistSongPayload(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, owner);
    await this._playlistSongsService.deleteSong(playlistId, songId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistSongsHandler;
