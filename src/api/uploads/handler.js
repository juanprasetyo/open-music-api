class UploadsHandler {
  constructor(uploadService, albumsService, validator) {
    this._uploadService = uploadService;
    this._albumsService = albumsService;
    this._validator = validator;
  }

  async postCoverAlbum(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    await this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._uploadService.writeFile(cover, cover.hapi);
    const imageUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    await this._albumsService.addCover(id, imageUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diubah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
