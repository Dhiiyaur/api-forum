const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(addComment) {
        const { content, thread, owner } = addComment;
        const id = `comment-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
            values: [id, content, owner, thread],
        };
        const result = await this._pool.query(query);
        return new AddedComment(result.rows[0]);
    }

    async deleteCommentById(id) {
        const updatedAt = new Date();
        const query = {
            text: 'UPDATE comments SET is_delete = true, updated_at = $2 WHERE id = $1',
            values: [id, updatedAt],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('id comment tidak ditemukan');
        }
    }

    async verifyAvailableIdComment(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (result.rowCount === 0) {
            throw new NotFoundError('id comment tidak ditemukan');
        }
    }

    async verifyCommentOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 and owner = $2',
            values: [id, owner],
        };

        const result = await this._pool.query(query);
        if (result.rowCount === 0) {
            throw new AuthorizationError('tidak dapat mengakses resource ini');
        }
    }

    async getCommentsByThreadId(thread) {
        const query = {
            text: 'SELECT a.*, b.username FROM comments a JOIN users b ON a.owner = b.id WHERE a.thread = $1 ORDER BY a.created_at ASC',
            values: [thread],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = CommentRepositoryPostgres;
