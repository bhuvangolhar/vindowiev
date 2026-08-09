exports.up = (pgm) => {
  pgm.addColumn('events', {
    venue_id: {
      type: 'integer',
      references: 'venues',
      onDelete: 'SET NULL',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('events', 'venue_id');
};