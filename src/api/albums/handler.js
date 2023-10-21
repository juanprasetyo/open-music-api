class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  post = async (request, h) => {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.add({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  };

  getAll = async () => {
    const albums = this._service.get();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  };

  getById = async (request) => {
    const { id } = request.params;

    const album = await this._service.getById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  };

  putById = async (request) => {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editById(id, request.payload);
    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  };

  deleteById = async (request) => {
    const { id } = request.params;

    await this._service.deleteById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  };
}

module.exports = AlbumsHandler;
