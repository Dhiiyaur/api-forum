const AddOrDeleteLikeUseCase = require('../AddOrDeleteLikeUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('AddOrDeleteLikeUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        const useCasePayload = {
            threadId: 'thread-321',
            commentId: 'comment-001',
            owner: 'user-321',
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockLikeRepository = new LikeRepository();

        mockThreadRepository.verifyAvailableIdThread = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyAvailableIdComment = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockLikeRepository.verifyLikeIsExist = jest.fn()
            .mockImplementation(() => Promise.resolve(false));
        mockLikeRepository.addLike = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const addOrDeleteLikeUseCase = new AddOrDeleteLikeUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            likeRepository: mockLikeRepository,
        });

        await addOrDeleteLikeUseCase.execute(useCasePayload);

        expect(mockThreadRepository.verifyAvailableIdThread).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyAvailableIdComment).toBeCalledWith(useCasePayload.commentId);
        expect(mockLikeRepository.verifyLikeIsExist).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockLikeRepository.addLike).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    });

    it('should orchestrating the delete comment action correctly', async () => {
        const useCasePayload = {
            threadId: 'thread-321',
            commentId: 'comment-001',
            owner: 'user-321',
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockLikeRepository = new LikeRepository();

        mockThreadRepository.verifyAvailableIdThread = jest.fn(() => Promise.resolve());
        mockCommentRepository.verifyAvailableIdComment = jest.fn(() => Promise.resolve());
        mockLikeRepository.verifyLikeIsExist = jest.fn(() => Promise.resolve(true));
        mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());

        const addOrDeleteLikeUseCase = new AddOrDeleteLikeUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            likeRepository: mockLikeRepository,
        });

        await addOrDeleteLikeUseCase.execute(useCasePayload);

        expect(mockThreadRepository.verifyAvailableIdThread).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyAvailableIdComment).toBeCalledWith(useCasePayload.commentId);
        expect(mockLikeRepository.verifyLikeIsExist).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockLikeRepository.deleteLike).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    });
});
