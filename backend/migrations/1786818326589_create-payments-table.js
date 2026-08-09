exports.up = (pgm) => {
  pgm.createTable('payments', {
    id: 'id',
    booking_id: {
      type: 'integer',
      notNull: true,
      references: 'bookings',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    transaction_id: { type: 'varchar(255)', notNull: true, unique: true },
    amount: { type: 'numeric(10, 2)', notNull: true },
    payment_method: { type: 'varchar(50)', notNull: true }, // e.g. 'card', 'upi', 'netbanking', 'stripe', 'razorpay'
    status: { type: 'varchar(20)', notNull: true, default: 'completed' }, // 'completed', 'pending', 'failed', 'refunded'
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('payments');
};