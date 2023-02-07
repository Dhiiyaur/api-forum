class Reply {
    constructor(payload) {
        this._verifyPayload(payload);
        const {
            id, username, comment_id, created_at, content, is_delete,
        } = payload;
        this.id = id;
        this.username = username;
        this.date = created_at;
        this.comment_id = comment_id;
        this.content = (!is_delete) ? content : '**balasan telah dihapus**';
    }

    _verifyPayload({
        id, username, comment_id, content, is_delete,
    }) {
        if (!id || !username || !comment_id || !content || (is_delete === undefined || is_delete === null)) {
            throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string'
            || typeof username !== 'string'
            || typeof comment_id !== 'string'
            || typeof content !== 'string'
            || typeof is_delete !== 'boolean'
        ) throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
}

module.exports = Reply;
