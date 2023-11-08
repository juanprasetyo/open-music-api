const ActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongActivities',
  version: '1.0.0',
  register: async (server, { playlistSongActivitiesService, playlistsService }) => {
    const activitiesHandler = new ActivitiesHandler(playlistSongActivitiesService, playlistsService);
    server.route(routes(activitiesHandler));
  },
};
