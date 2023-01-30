const AddReplyUseCase = require('../AddReplyUseCase');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddReplyUseCase', () => {
    it('should orchestrating the add reply action correctly', async () => {
        const useCasePayload = {
            content: 'coba reply',
            owner: 'user-123',
            commentId: 'comment-123',
        };
        const expectedAddedReply = new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        });

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.verifyAvailableIdThread = jest.fn(() => Promise.resolve());
        mockCommentRepository.verifyAvailableIdComment = jest.fn(() => Promise.resolve());
        mockReplyRepository.addReply = jest.fn(() => Promise.resolve(new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        })));

        const addReplyUseCase = new AddReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        const addedReply = await addReplyUseCase.execute(useCasePayload);

        expect(addedReply).toStrictEqual(expectedAddedReply);
        expect(mockThreadRepository.verifyAvailableIdThread).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyAvailableIdComment).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
            content: useCasePayload.content,
            owner: useCasePayload.owner,
            commentId: useCasePayload.commentId,
        }));
    });
});
