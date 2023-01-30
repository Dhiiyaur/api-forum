const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'judul thread',
        };
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            body: 123,
            title: 'judul thread',
            owner: 123,
        };
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('must create addThread object Correctly', () => {
        const payload = {
            title: 'judul thread',
            body: 'body thread',
            owner: 'user-123',
        };

        const { title, body, owner } = new AddThread(payload);

        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(owner).toEqual(payload.owner);
    });
});
