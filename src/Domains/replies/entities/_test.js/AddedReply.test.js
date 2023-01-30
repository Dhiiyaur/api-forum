const AddedReply = require('../AddedReply');

describe('a CreatedReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            content: 'coba balas',
        };
        expect(() => new AddedReply(payload)).toThrowError('ADD_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            content: true,
            owner: 'user-123',
        };
        expect(() => new AddedReply(payload)).toThrowError('ADD_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create createdReply object correctly', () => {
        const payload = {
            id: 'reply-123',
            content: 'coba balas',
            owner: 'user-123',
        };
        const addedReply = new AddedReply(payload);
        expect(addedReply.id).toEqual(payload.id);
        expect(addedReply.content).toEqual(payload.content);
        expect(addedReply.owner).toEqual(payload.owner);
    });
});
