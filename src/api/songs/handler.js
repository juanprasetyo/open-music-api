class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async post(request, h) {
    this._validator.validateSongPayload(request.payload);

    const songId = await this._service.add(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });

    response.code(201);
    return response;
  }

  async getAll(request) {
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
  }

  async getById(request) {
    const { id } = request.params;

    const song = await this._service.getById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putById(request) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.editById(id, request.payload);
    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteById(request) {
    const { id } = request.params;

    await this._service.deleteById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
