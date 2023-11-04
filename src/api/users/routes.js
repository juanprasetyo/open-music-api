const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.post(request, h),
  },
];

module.exports = routes;
