const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
    async addLike({
        id,
        owner,
        commentId,
    }) {
        const query = {
            text : 'insert into likes values($1, $2, $3)',
            values: [id, owner, commentId],
        }

        await pool.query(query);
    },

    async findLikesByCommentIdAndOwner(commentId, owner) {
        const query = {
            text: 'select * from likes where comment_id = $1 and owner = $2',
            values: [commentId, owner]
        }

        const result = await pool.query(query)
        return result.rows
    },

    async cleanTable() {
        await pool.query('DELETE FROM likes WHERE 1=1');
      },
    
}

module.exports = LikesTableTestHelper;
