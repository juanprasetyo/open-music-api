class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  post = async (request, h) => {
    await this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const userId = await this._service.add({ username, password, fullname });

    const response = h.response({
      status: 'success',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  };
}

module.exports = UsersHandler;
