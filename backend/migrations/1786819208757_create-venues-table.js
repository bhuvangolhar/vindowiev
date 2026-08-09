exports.up = (pgm) => {
  pgm.createTable('venues', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    address: { type: 'text', notNull: true },
    city: { type: 'varchar(100)', notNull: true },
    state: { type: 'varchar(100)' },
    zip_code: { type: 'varchar(20)' },
    capacity: { type: 'integer', notNull: true },
    contact_phone: { type: 'varchar(20)' },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('venues');
};