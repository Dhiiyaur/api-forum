const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addThread function', () => {
        it('should persist create thread and return created thread correctly', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            const addThread = new AddThread({
                title: 'judul - Title',
                body: 'isi body',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            const addedThread = await threadRepositoryPostgres.addThread(addThread);

            const threads = await ThreadsTableTestHelper.findThreadsById(addedThread.id);
            expect(threads).toHaveLength(1);
            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-123',
                title: addThread.title,
                owner: addThread.owner,
            }));
        });
    });

    describe('verifyAvailableIdThread function', () => {
        it('should throw NotFoundError when thread not found', async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            return expect(threadRepositoryPostgres.verifyAvailableIdThread('thread-123'))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError when thread found by id', async () => {
            const threadId = 'thread-123';
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: threadId });
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
            return expect(threadRepositoryPostgres.verifyAvailableIdThread(threadId))
                .resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('getDetailThread function', () => {
        it('should get detail thread', async () => {
            const threadRepository = new ThreadRepositoryPostgres(pool, {});
            const userPayload = { id: 'user-123', username: 'karina' };
            const threadPayload = {
                id: 'thread-g_3321',
                title: 'ini judul thread',
                body: 'ini thread',
                owner: 'user-123',
            };
            await UsersTableTestHelper.addUser(userPayload);
            await ThreadsTableTestHelper.addThread(threadPayload);

            const detailThread = await threadRepository.getDetailThread(threadPayload.id);
            expect(detailThread.id).toEqual(threadPayload.id);
            expect(detailThread.title).toEqual(threadPayload.title);
            expect(detailThread.body).toEqual(threadPayload.body);
            expect(detailThread.username).toEqual(userPayload.username);
        });
    });
});
