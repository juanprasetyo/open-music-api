const InvariantError = require('../../exceptions/InvariantError');
const { AlbumPayloadSchema } = require('./schema');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const valdationResult = AlbumPayloadSchema.validate(payload);
    if (valdationResult.error) {
      throw new InvariantError(valdationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;
