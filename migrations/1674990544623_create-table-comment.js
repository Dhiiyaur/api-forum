exports.up = (pgm) => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        thread: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        is_delete: {
            type: 'BOOLEAN',
            default: false,
            notNull: false,
        },
    });
    pgm.addConstraint('comments', 'fk_comments.user_owner.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('comments', 'fk_comments.comment_thread.id', 'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropTable('comments');
};
