const pool = require('../../database/postgres/pool');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await LikesTableTestHelper.cleanTable();
    });

    describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
        it('should response 200 and persisted like ( thread and comment exist', async () => {
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            const dataTest = {
                threadId: 'thread-321',
                commentId: 'comment-321',
            };

            await ThreadsTableTestHelper.addThread({ id: dataTest.threadId });
            await CommentsTableTestHelper.addComment({ id: dataTest.commentId, thread: dataTest.threadId });

            const response = await server.inject({
                method: 'PUT',
                url: `/threads/${dataTest.threadId}/comments/${dataTest.commentId}/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = await JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

        it('should response 404 and persisted like ( thread and comment doesnt exist', async () => {
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            const dataTest = {
                threadId: 'thread-322',
                commentId: 'comment-322',
            };

            const response = await server.inject({
                method: 'PUT',
                url: `/threads/${dataTest.threadId}/comments/${dataTest.commentId}/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toBeDefined();
        });
    });
});
