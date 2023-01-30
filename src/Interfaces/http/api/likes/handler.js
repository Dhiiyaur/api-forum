const AddOrDeleteLikeUseCase = require('../../../../Applications/use_case/AddOrDeleteLikeUseCase');

class LikesHandler {
    constructor(container) {
        this._container = container;
        this.putLikeHandler = this.putLikeHandler.bind(this);
    }

    async putLikeHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const { threadId, commentId } = request.params;
        const addOrDeleteLikeUseCase = this._container.getInstance(AddOrDeleteLikeUseCase.name);

        const payload = {
            owner: userId,
            threadId,
            commentId,
        };

        await addOrDeleteLikeUseCase.execute(payload);
        const response = h.response({ status: 'success' });
        response.code(200);
        return response;
    }
}

module.exports = LikesHandler;
