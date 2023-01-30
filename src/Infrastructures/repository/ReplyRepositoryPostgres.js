const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply(newReply) {
        const { content, owner, commentId } = newReply;
        const id = `reply-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO replies(id, content, owner, comment_id) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
            values: [id, content, owner, commentId],
        };

        const result = await this._pool.query(query);
        return new AddedReply({ ...result.rows[0] });
    }

    async getReplies(threadId, commentId) {
        const query = {
            text: `
            select r.id, r.content, r.created_at, u.username, r.is_delete, r.comment_id
            from replies r 
            inner join users u on u.id = r."owner" 
            inner join "comments" c on c.id = r.comment_id 
            where c.thread = $1 and c.id = $2
            order by r.created_at asc
            `,
            values: [threadId, commentId],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async verifyReplyIsExist(replyId) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [replyId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('balasan tidak ditemukan');
        }
    }

    async verifyReplyOwner(replyId, owner) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
            values: [replyId, owner],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new AuthorizationError('tidak dapat mengakses resource ini');
        }
    }

    async deleteReplyById(replyId) {
        const query = {
            text: 'UPDATE replies SET is_delete = true WHERE id = $1',
            values: [replyId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('balasan tidak ditemukan');
        }
    }
}

module.exports = ReplyRepositoryPostgres;
