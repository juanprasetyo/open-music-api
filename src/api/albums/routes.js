const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.post,
  },
  {
    method: 'GET',
    path: '/albums',
    handler: handler.getAll,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getById,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putById,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteById,
  },
];

module.exports = routes;
