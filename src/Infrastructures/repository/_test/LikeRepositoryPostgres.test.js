const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await LikesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addLike function', () => {
        it('should persist add like correctly', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-321', owner: 'user-123' });

            const payload = {
                id: 'like-123',
                commentId: 'comment-321',
                owner: 'user-123',
            };

            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
            await likeRepositoryPostgres.addLike(payload.commentId, payload.owner);
            const likes = await LikesTableTestHelper
                .findLikesByCommentIdAndOwner(payload.commentId, payload.owner);
            expect(likes).toHaveLength(1);
        });
    });

    describe('deletelike function', () => {
        it('should persist delete like correctly if like exist', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-321', owner: 'user-123' });

            const payload = {
                id: 'like-123',
                commentId: 'comment-321',
                owner: 'user-123',
            };

            await LikesTableTestHelper.addLike({ id: payload.id, owner: payload.owner, commentId: payload.commentId });

            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            await likeRepositoryPostgres.deleteLike(payload.commentId, payload.owner);
            await likeRepositoryPostgres.deleteLike(payload.commentId, payload.owner);
            const likes = await LikesTableTestHelper
                .findLikesByCommentIdAndOwner(payload.commentId, payload.owner);
            expect(likes).toHaveLength(0);
        });
    });

    describe('verifyLikeIsExist function', () => {
        it('return true if like exist', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-321', owner: 'user-123' });

            const payload = {
                id: 'like-123',
                commentId: 'comment-321',
                owner: 'user-123',
            };

            await LikesTableTestHelper.addLike({ id: payload.id, owner: payload.owner, commentId: payload.commentId });
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
            const isExist = await likeRepositoryPostgres.verifyLikeIsExist(payload.commentId, payload.owner);
            expect(isExist).toBeDefined();
            expect(isExist).toStrictEqual(true);
        });

        it('return false if like doesnt exist', async () => {
            const payload = {
                commentId: 'comment-321',
                owner: 'user-321',
            };
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
            const isExist = await likeRepositoryPostgres.verifyLikeIsExist(payload.commentId, payload.owner);
            expect(isExist).toBeDefined();
            expect(isExist).toStrictEqual(false);
        });
    });

    describe('getCountLike function', () => {
        it('should persist count like', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-321', owner: 'user-123' });

            const payload = {
                id: 'like-123',
                commentId: 'comment-321',
                owner: 'user-123',
            };

            await LikesTableTestHelper.addLike({ id: payload.id, owner: payload.owner, commentId: payload.commentId });

            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
            const countLikes = await likeRepositoryPostgres.getCountLike(payload.commentId);
            expect(countLikes).toBeDefined();
            expect(countLikes).toEqual(1);
        });
    });
});
