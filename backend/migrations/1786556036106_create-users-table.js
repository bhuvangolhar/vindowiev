exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    role: { type: 'varchar(20)', notNull: true, default: 'user' },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};