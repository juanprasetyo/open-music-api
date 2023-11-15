/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('albums', {
    cover: {
      type: 'TEXT',
      null: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('albums', 'cover');
};
