const InvariantError = require('../../exceptions/InvariantError');
const { SongPayloadSchema } = require('./schema');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const valdationResult = SongPayloadSchema.validate(payload);
    if (valdationResult.error) {
      throw new InvariantError(valdationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
