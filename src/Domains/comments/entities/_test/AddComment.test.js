const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            owner: 'user-123',
        };
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            content: 123,
            thread: 'thread-123',
            owner: 123,
        };
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('must create addComment object Correctly', () => {
        const payload = {
            content: 'ini comment',
            thread: 'thread-123',
            owner: 'user-123',
        };

        const { content, thread, owner } = new AddComment(payload);

        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
        expect(thread).toEqual(payload.thread);
    });
});
