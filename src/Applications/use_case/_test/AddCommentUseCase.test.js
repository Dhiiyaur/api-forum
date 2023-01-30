const AddCommentUseCase = require('../AddCommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        const useCasePayload = {
            content: 'test comment',
            owner: 'user-123',
            thread: 'thread-123',
        };
        const expectedAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        });

        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.verifyAvailableIdThread = jest.fn(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(new AddedComment({
                id: 'comment-123',
                content: useCasePayload.content,
                owner: useCasePayload.owner,
            })));

        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        const addedComment = await addCommentUseCase.execute(useCasePayload);
        expect(addedComment).toStrictEqual(expectedAddedComment);
        expect(mockThreadRepository.verifyAvailableIdThread).toBeCalledWith(useCasePayload.thread);
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
            content: useCasePayload.content,
            owner: useCasePayload.owner,
            thread: useCasePayload.thread,
        }));
    });
});
