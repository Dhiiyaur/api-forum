const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const deleteComment = new DeleteComment(useCasePayload);
        await this._threadRepository.verifyAvailableIdThread(deleteComment.thread);
        await this._commentRepository.verifyAvailableIdComment(deleteComment.id);

        await this._commentRepository.verifyCommentOwner(deleteComment.id, deleteComment.owner);
        await this._commentRepository.deleteCommentById(deleteComment.id);
    }
}

module.exports = DeleteCommentUseCase;
