const Comment = require('../Commets');

describe('a Comment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {};

        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'comment-123',
            content: 'what',
            username: true,
            created_at: true,
            is_delete: true,
        };

        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create Comment object Correctly', () => {
        const payload = {
            id: 'comment-123',
            content: 'comment sebuah thread 1',
            username: 'karina',
            is_delete: true,
            created_at: new Date('2022-02-02'),
        };

        const expectedComment = {
            id: 'comment-123',
            content: '**komentar telah dihapus**',
            username: 'karina',
            date: new Date('2022-02-02'),
        };

        const comment = new Comment(payload);
        expect(comment).toEqual(expectedComment);
    });

    it('should create Comment object Correctly if false', () => {
        const payload = {
            id: 'comment-123',
            content: 'comment sebuah thread 1',
            username: 'karina',
            is_delete: false,
            created_at: new Date('2022-02-02'),
        };

        const expectedComment = {
            id: 'comment-123',
            content: 'comment sebuah thread 1',
            username: 'karina',
            date: new Date('2022-02-02'),
        };

        const comment = new Comment(payload);
        expect(comment).toEqual(expectedComment);
    });
});
