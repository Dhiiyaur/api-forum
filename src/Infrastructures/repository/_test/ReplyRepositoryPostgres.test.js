const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

const pool = require('../../database/postgres/pool');

const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const Reply = require('../../../Domains/replies/entities/Reply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ReplyRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('add Reply function', () => {
        it('should persist create reply and return created reply correctly', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123' });
            const addReply = new AddReply({
                content: 'isi reply',
                owner: 'user-123',
                commentId: 'comment-123',
            });
            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
            const addedReply = await replyRepositoryPostgres.addReply(addReply);
            const replies = await RepliesTableTestHelper.findRepliesById(addedReply.id);
            expect(replies).toHaveLength(1);
            expect(addedReply).toStrictEqual(new AddedReply({
                id: 'reply-123',
                content: addReply.content,
                owner: addReply.owner,
            }));
        });
    });

    describe('getRepliesByThreadId function', () => {
        it('should return replies by thread id correctly', async () => {
            const threadId = 'thread-123';
            const commentId = 'comment-123';
            const replyData = {
                id: 'reply-123',
                content: 'isi reply',
                owner: 'user-123',
                commentId: 'comment-123',
                date: 'fake date',
            };
            const userData = {
                id: 'user-123',
                username: 'the-username',
            };
            await UsersTableTestHelper.addUser(userData);
            await ThreadsTableTestHelper.addThread({ id: threadId });
            await CommentsTableTestHelper.addComment({ id: commentId });
            await RepliesTableTestHelper.addReply(replyData);
            const fakeIdGenerator = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

            const repliesByThreadId = await replyRepositoryPostgres.getReplies(threadId, commentId);
            const reply1 = new Reply(repliesByThreadId[0]);
            const expectedreply1 = {
                id: 'reply-123',
                username: 'the-username',
                date: reply1.date,
                comment_id: 'comment-123',
                content: 'isi reply',
            };
            expect(reply1).toEqual(expectedreply1);
        });
    });

    describe('verifyReplyIsExist function', () => {
        it('should throw NotFoundError when reply not found', () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            return expect(replyRepositoryPostgres.verifyReplyIsExist('hello-world'))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError when reply found', async () => {
            const replyId = 'reply-123';
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123' });
            await RepliesTableTestHelper.addReply({ id: replyId });
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            return expect(replyRepositoryPostgres.verifyReplyIsExist(replyId))
                .resolves
                .not
                .toThrowError(NotFoundError);
        });
    });

    describe('verifyReplyOwner function', () => {
        it('should throw UnauthorizedError when provided userId is not the reply owner', async () => {
            const commentId = 'comment-123';
            const replyId = 'reply-123';
            const userId = 'user-123';
            const wrongUserId = 'user-456';
            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({
                id: commentId,
            });
            await RepliesTableTestHelper.addReply({
                id: replyId, owner: userId, commentId,
            });
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}); // Action & Assert
            await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, wrongUserId)).rejects.toThrowError(AuthorizationError);
        });

        it('should verify the reply owner correctly', async () => {
            const commentId = 'comment-123';
            const replyId = 'reply-123';
            const userId = 'user-123';
            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({
                id: commentId,
            });
            await RepliesTableTestHelper.addReply({
                id: replyId, owner: userId, commentId,
            });
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, userId)).resolves.not.toThrowError(AuthorizationError);
        });
    });

    describe('deleteReplyById function', () => {
        it('should throw NotFoundError when reply not found', () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            return expect(replyRepositoryPostgres.deleteReplyById('hello-world'))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should delete reply by id and return success correctly', async () => {
            const commentId = 'comment-123';
            const replyId = 'reply-123';
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({
                id: commentId,
            });
            await RepliesTableTestHelper.addReply({ id: replyId, owner: 'user-123', commentId });
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            await replyRepositoryPostgres.deleteReplyById(replyId);

            const replies = await RepliesTableTestHelper.findRepliesById(replyId);
            expect(replies).toHaveLength(1);
            expect(replies[0].is_delete).toEqual(true);
        });
    });
});
