const Reply = require('../Reply');

describe('a Comment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {};

        expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'reply-123',
            username: true,
            created_at: true,
            comment_id: 'comment-123',
            is_delete: true,
            content: true,
        };

        expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Reply object Correctly', () => {
        const payload = {
            id: 'reply-123',
            content: 'reply Content',
            created_at: '2023-01-09T02:22:11.034Z',
            username: 'user-123',
            is_delete: true,
            comment_id: 'comment-123',
        };

        const expectedReply = {
            id: 'reply-123',
            content: '**balasan telah dihapus**',
            date: '2023-01-09T02:22:11.034Z',
            username: 'user-123',
            comment_id: 'comment-123',
        };

        const reply = new Reply(payload);
        expect(reply).toEqual(expectedReply);
    });

    it('should create Reply object Correctly if false', () => {
        const payload = {
            id: 'reply-123',
            content: 'reply Content',
            created_at: '2023-01-09T02:22:11.034Z',
            username: 'user-123',
            is_delete: false,
            comment_id: 'comment-123',
        };

        const expectedReply = {
            id: 'reply-123',
            content: 'reply Content',
            date: '2023-01-09T02:22:11.034Z',
            username: 'user-123',
            comment_id: 'comment-123',
        };

        const reply = new Reply(payload);
        expect(reply).toEqual(expectedReply);
    });
});
