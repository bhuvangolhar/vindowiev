exports.up = (pgm) => {
  pgm.createTable('bookings', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    event_id: {
      type: 'integer',
      notNull: true,
      references: 'events',
      onDelete: 'CASCADE',
    },
    seats_booked: { type: 'integer', notNull: true },
    total_price: { type: 'numeric(10, 2)', notNull: true },
    status: { type: 'varchar(20)', notNull: true, default: 'confirmed' },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('bookings');
};