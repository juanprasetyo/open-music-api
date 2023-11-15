class AlbumLikesHandler {
  constructor(albumLikesService, albumsService) {
    this._albumLikesService = albumLikesService;
    this._albumsService = albumsService;
  }

  async post(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumsService.getById(albumId);
    await this._albumLikesService.verifyUserLikedBefore(userId, albumId);
    await this._albumLikesService.add(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    response.code(201);
    return response;
  }

  async get(request) {
    const { id: albumId } = request.params;

    await this._albumsService.getById(albumId);
    const likes = await this._albumLikesService.getTotalLikes(albumId);
    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }

  async delete(request) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumLikesService.delete(userId, albumId);
    return {
      status: 'success',
      message: 'Berhasil batal menyukai album',
    };
  }
}

module.exports = AlbumLikesHandler;
