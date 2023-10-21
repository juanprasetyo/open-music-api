/* eslint-disable object-curly-newline */
class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  post = async (request, h) => {
    this._validator.validateSongPayload(request.payload);
    const { title, year, genre, performer, duration, albumId } = request.payload;

    const songId = await this._service.add({ title, year, genre, performer, duration, albumId });

    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });

    response.code(201);
    return response;
  };

  getAll = async (request) => {
    let songs = await this._service.get();

    if (request.query.title && request.query.performer) {
      songs = await this._service.getByTitleAndPerformer(request.query);
    }
    if (request.query.title) {
      songs = await this._service.getByTitle(request.query.title);
    }
    if (request.query.performer) {
      songs = await this._service.getByPerformer(request.query.performer);
    }

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  };

  getById = async (request) => {
    const { id } = request.params;

    const song = await this._service.getById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  };

  putById = async (request) => {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.editById(id, request.payload);
    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  };

  deleteById = async (request) => {
    const { id } = request.params;

    await this._service.deleteById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  };
}

module.exports = SongsHandler;
