class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;
  }

  async post(request, h) {
    await this._validator.validateCollaborationPayload(request.payload);
    const { id: owner } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._usersService.getById(userId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    const collaborationId = await this._collaborationsService.add(playlistId, userId);

    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async delete(request) {
    await this._validator.validateCollaborationPayload(request.payload);
    const { id: owner } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._collaborationsService.delete(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
