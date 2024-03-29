const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DeleteReplyUseCase', () => {
    it('should orchestrating the delete reply action correctly', async () => {
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            replyId: 'reply-123',
            owner: 'user-123',
        };
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.verifyAvailableIdThread = jest.fn(() => Promise.resolve());
        mockCommentRepository.verifyAvailableIdComment = jest.fn(() => Promise.resolve());
        mockReplyRepository.verifyReplyIsExist = jest.fn(() => Promise.resolve());
        mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
        mockReplyRepository.deleteReplyById = jest.fn(() => Promise.resolve());

        const deleteReplyUseCase = new DeleteReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        await deleteReplyUseCase.execute(useCasePayload);

        expect(mockThreadRepository.verifyAvailableIdThread)
            .toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyAvailableIdComment)
            .toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.verifyReplyIsExist)
            .toBeCalledWith(useCasePayload.replyId);
        expect(mockReplyRepository.verifyReplyOwner)
            .toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
        expect(mockReplyRepository.deleteReplyById)
            .toBeCalledWith(useCasePayload.replyId);
    });
});
