const Comment = require('../../Domains/comments/entities/Commets');
const Reply = require('../../Domains/replies/entities/Reply');

class DetailThreadUseCase {
    constructor({
        commentRepository, threadRepository, replyRepository, likeRepository,
    }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
        this._replyRepository = replyRepository;
        this._likeRepository = likeRepository;
    }

    async execute(useCasePayload) {
        await this._threadRepository.verifyAvailableIdThread(useCasePayload);
        const thread = await this._threadRepository.getDetailThread(useCasePayload);
        const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload);
        const mapComments = comments.map((comment) => new Comment(comment));
        for (const comment of mapComments) {
            const replies = await this._replyRepository.getReplies(useCasePayload, comment.id);
            comment.replies = replies.map((reply) => new Reply(reply));
            const totalLikes = await this._likeRepository.getCountLike(comment.id);
            comment.likeCount = totalLikes;
        }

        thread.comments = mapComments;
        return thread;
    }
}

module.exports = DetailThreadUseCase;
