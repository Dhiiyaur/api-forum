const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const Comment = require('../../../Domains/comments/entities/Commets');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persis add comment correctly', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            const addComment = new AddComment({
                content: 'sebuah comment',
                thread: 'thread-123',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            await commentRepositoryPostgres.addComment(addComment);
            const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
            expect(comments).toHaveLength(1);
        });

        it('should return add comment correctly', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            const addComment = new AddComment({
                content: 'sebuah comment',
                thread: 'thread-123',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            const addedComment = await commentRepositoryPostgres.addComment(addComment);
            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: 'sebuah comment',
                owner: 'user-123',
            }));
        });
    });

    describe('verifyCommentOwner function', () => {
        it('should not throw error Authorization when is valid owner', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            const data = { id: 'comment-123', owner: 'user-123' };
            const id = 'comment-123';
            const { owner } = data;
            await CommentsTableTestHelper.addComment(data);
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            expect(commentRepositoryPostgres.verifyCommentOwner(id, owner)).resolves.not.toThrowError(AuthorizationError);
        });

        it('should throw error Authorization', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            const data = { id: 'comment-123', owner: 'user-123' };
            const id = 'comment-123';
            const owner = 'user-321';
            await CommentsTableTestHelper.addComment(data);
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            expect(commentRepositoryPostgres.verifyCommentOwner(id, owner)).rejects.toThrowError(AuthorizationError);
        });
    });

    describe('getCommentsByThreadId function', () => {
        it('should persis get comments correctly', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'karina' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

            const payloadComment1 = {
                id: 'comment-123',
                thread: 'thread-123',
                is_delete: false,
                content: 'comment sebuah thread',
                owner: 'user-123',
            };

            const payloadComment2 = {
                id: 'comment-223',
                thread: 'thread-123',
                is_delete: true,
                owner: 'user-123',
            };

            await CommentsTableTestHelper.addComment(payloadComment1);
            await CommentsTableTestHelper.addComment(payloadComment2);

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
            const comment1 = new Comment(comments[0]);
            const comment2 = new Comment(comments[1]);

            const expectedComment1 = {
                id: 'comment-123',
                content: 'comment sebuah thread',
                username: 'karina',
                date: comment1.date,
            };

            const expectedComment2 = {
                id: 'comment-223',
                content: '**komentar telah dihapus**',
                username: 'karina',
                date: comment2.date,
            };

            expect(comment1).toEqual(expectedComment1);
            expect(comment2).toEqual(expectedComment2);
        });
    });

    describe('verifyAvailableIdComment function', () => {
        it('shold throw not found error', async () => {
            const commentId = 'comment-123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            expect(commentRepositoryPostgres.verifyAvailableIdComment(commentId)).rejects.toThrowError(NotFoundError);
        });
    });
});
