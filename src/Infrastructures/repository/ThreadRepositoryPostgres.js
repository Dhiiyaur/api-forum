const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(addThread) {
        const { title, body, owner } = addThread;
        const id = `thread-${this._idGenerator()}`;
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
            values: [id, title, body, owner],
        };
        const result = await this._pool.query(query);
        return new AddedThread({ ...result.rows[0] });
    }

    async verifyAvailableIdThread(id) {
        const query = {
            text: 'SELECT id FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('id thread tidak ditemukan');
        }
    }

    async getDetailThread(id) {
        const query = {
            text: 'SELECT a.*, b.username FROM threads a JOIN users b ON a.owner = b.id WHERE a.id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);
        return new DetailThread(result.rows[0]);
    }
}

module.exports = ThreadRepositoryPostgres;
