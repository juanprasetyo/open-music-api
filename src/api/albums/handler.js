class AlbumsHandler {
  constructor(albumsService, songsService, validator) {
    this._albumsService = albumsService;
    this._songsService = songsService;
    this._validator = validator;
  }

  async post(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._albumsService.add({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAll() {
    const albums = await this._albumsService.get();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getById(request) {
    const { id } = request.params;

    const album = await this._albumsService.getById(id);
    const albumSongs = await this._songsService.getByAlbumId(id);
    album.songs = albumSongs;

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putById(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._albumsService.editById(id, request.payload);
    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteById(request) {
    const { id } = request.params;

    await this._albumsService.deleteById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
