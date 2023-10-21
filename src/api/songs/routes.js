const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.post,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getAll,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getById,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putById,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteById,
  },
];

module.exports = routes;
