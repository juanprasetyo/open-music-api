class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async post(request, h) {
    await this._validator.validateExportPlaylistPayload(request.payload);
    const { playlistId } = request.params;
    const userId = request.auth.credentials.id;

    await this._playlistsService.getById(playlistId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

    const message = {
      userId,
      targetEmail: request.targetEmail,
    };

    await this._producerService.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
