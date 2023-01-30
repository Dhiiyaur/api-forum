const AddReply = require('../AddReply');

describe('AddReply entities', () => {
    it('should throw error when payload does not contain needed property', () => {
        const payload = {
            content: 'coba balas',
        };
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        const payload = {
            content: 12345,
            owner: { id: 'user-123' },
            commentId: 'comment-123',
        };
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create CreateReply entities correctly', () => {
        const payload = {
            content: 'coba balas',
            owner: 'user-123',
            commentId: 'comment-123',
        };

        const addReply = new AddReply(payload);
        expect(addReply).toBeInstanceOf(AddReply);
        expect(addReply.content).toEqual(payload.content);
        expect(addReply.owner).toEqual(payload.owner);
        expect(addReply.commentId).toEqual(payload.commentId);
    });
});
