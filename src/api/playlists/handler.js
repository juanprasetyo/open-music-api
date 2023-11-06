class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async post(request, h) {
    await this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;
    const playlistId = await this._service.add(name, owner);

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async get(request) {
    const { id: owner } = request.auth.credentials;
    const playlists = await this._service.get(owner);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async delete(request) {
    const { id } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, owner);
    await this._service.delete(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }
}

module.exports = PlaylistsHandler;
