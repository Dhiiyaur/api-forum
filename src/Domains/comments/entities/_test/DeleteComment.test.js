const DeleteComment = require('../DeleteComment');

describe('a DeleteComment', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            owner: 'user-123',
        };

        expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            owner: 123,
            thread: 111,
        };

        expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('must create deleteComment object Correctly', () => {
        const payload = {
            id: 'comment-123',
            owner: 'user-123',
            thread: 'thread-123',
        };

        const { id, owner, thread } = new DeleteComment(payload);

        expect(id).toEqual(payload.id);
        expect(owner).toEqual(payload.owner);
        expect(thread).toEqual(payload.thread);
    });
});
