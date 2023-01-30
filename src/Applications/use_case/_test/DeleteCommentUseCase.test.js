const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
    it('should orchestrating the delete comment action correctly', async () => {
        const useCasePayload = {
            thread: 'thread-123',
            id: 'comment-123',
            owner: 'user-123',
        };

        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyAvailableIdThread = jest.fn(() => Promise.resolve());
        mockCommentRepository.verifyAvailableIdComment = jest.fn(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
        mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        await deleteCommentUseCase.execute(useCasePayload);

        expect(mockThreadRepository.verifyAvailableIdThread)
            .toBeCalledWith(useCasePayload.thread);
        expect(mockCommentRepository.verifyAvailableIdComment)
            .toBeCalledWith(useCasePayload.id);
        expect(mockCommentRepository.verifyCommentOwner)
            .toBeCalledWith(useCasePayload.id, useCasePayload.owner);
        expect(mockCommentRepository.deleteCommentById)
            .toBeCalledWith(useCasePayload.id);
    });
});
