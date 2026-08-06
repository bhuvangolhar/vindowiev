exports.up = (pgm) => {
  pgm.createTable('events', {
    id: 'id',
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    category: { type: 'varchar(50)', notNull: true },
    event_date: { type: 'timestamp with time zone', notNull: true },
    location: { type: 'varchar(255)', notNull: true },
    price: { type: 'numeric(10, 2)', notNull: true },
    image_url: { type: 'text' },
    total_seats: { type: 'integer', notNull: true },
    available_seats: { type: 'integer', notNull: true },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('events');
};