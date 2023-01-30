const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addLike(commentId, owner) {
        const id = `like-${this._idGenerator()}`;

        const query = {
            text: 'insert into likes values($1, $2, $3) returning id',
            values: [id, owner, commentId],
        };

        await this._pool.query(query);
    }

    async deleteLike(commentId, owner) {
        const query = {
            text: 'delete from likes where comment_id = $1 and owner = $2',
            values: [commentId, owner],
        };

        await this._pool.query(query);
    }

    async verifyLikeIsExist(commentId, owner) {
        const query = {
            text: 'select * from likes where comment_id = $1 and owner = $2',
            values: [commentId, owner],
        };

        const result = await this._pool.query(query);
        if (result.rowCount) {
            return true;
        }
        return false;
    }

    async getCountLike(commentId) {
        const query = {
            text: 'select count(*) from likes where comment_id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);
        return parseInt(result.rows[0].count);
    }
}

module.exports = LikeRepositoryPostgres;
