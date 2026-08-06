exports.up = (pgm) => {
  pgm.createTable('event_seats', {
    id: 'id',
    event_id: {
      type: 'integer',
      notNull: true,
      references: 'events',
      onDelete: 'CASCADE',
    },
    seat_number: { type: 'varchar(20)', notNull: true }, // e.g. 'A1', 'B12'
    seat_row: { type: 'varchar(10)', notNull: true },    // e.g. 'A', 'B'
    tier: { type: 'varchar(30)', notNull: true, default: 'Standard' }, // VIP, Gold, Standard
    price: { type: 'numeric(10, 2)', notNull: true },
    is_reserved: { type: 'boolean', notNull: true, default: false },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Ensure no duplicate seat numbers exist for the same event
  pgm.addConstraint('event_seats', 'unique_event_seat', {
    unique: ['event_id', 'seat_number'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('event_seats');
};