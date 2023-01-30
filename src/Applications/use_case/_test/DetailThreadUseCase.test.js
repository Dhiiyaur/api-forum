const DetailThreadUseCase = require('../DetailThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('DetailThreadUseCase', () => {
    it('should orchestrating the detail thread action correctly', async () => {
        const useCaseThreadPayload = 'thread-123';

        const expectedThread = new DetailThread({
            id: useCaseThreadPayload,
            title: 'judul - Title',
            body: 'isi Body',
            username: 'user-123',
            created_at: '2023-01-09T02:22:11.034Z',
        });

        const expectedComments = [
            {
                id: 'comment-123',
                content: 'comment sebuah thread 1',
                username: 'karina',
                is_delete: true,
                created_at: '2022-02-02T02:22:09.775Z',

            },
        ];

        const expectedReplies = [
            {
                id: 'reply-123',
                content: 'reply Content',
                created_at: '2023-01-09T02:22:11.034Z',
                username: 'user-123',
                is_delete: false,
                comment_id: 'comment-123',
            },
        ];

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();
        const mockLikeRepository = new LikeRepository();

        mockThreadRepository.verifyAvailableIdThread = jest.fn(() => Promise.resolve());
        mockThreadRepository.getDetailThread = jest.fn(() => Promise.resolve(expectedThread));
        mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(expectedComments));
        mockReplyRepository.getReplies = jest.fn(() => Promise.resolve(expectedReplies));
        mockLikeRepository.getCountLike = jest.fn(() => Promise.resolve(5));

        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
            likeRepository: mockLikeRepository,
        });

        const detailThread = await detailThreadUseCase.execute(useCaseThreadPayload);
        expect(detailThread).toStrictEqual(expectedThread);
        expect(detailThread.comments[0].id).toStrictEqual(expectedComments[0].id);
        expect(detailThread.comments[0].replies[0].id).toStrictEqual(expectedReplies[0].id);
        expect(detailThread.comments[0].likeCount).toStrictEqual(5);
    });
});
