const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'judul thread',
        };

        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            body: 123,
            title: 'judul thread',
            id: 123,
            created_at: 1,
            username: 1,
            comments: 1,
        };
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('must create DetailThread object Correctly', () => {
        const payload = {
            body: 'body thread',
            title: 'judul thread',
            id: 'thread-123',
            created_at: '2023-08-08T08:12:03.442Z',
            username: 'karina',
        };

        const {
            body, title, id, date, username,
        } = new DetailThread(payload);

        expect(body).toEqual(payload.body);
        expect(title).toEqual(payload.title);
        expect(id).toEqual(payload.id);
        expect(date).toEqual(payload.created_at);
        expect(username).toEqual(payload.username);
    });
});
