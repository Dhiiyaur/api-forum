const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DetailThreadUseCase = require('../../../../Applications/use_case/DetailThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadHandler = this.getThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const { title, body } = request.payload;
        const { id } = request.auth.credentials;
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute({ title, body, owner: id });

        const response = h.response({
            status: 'success',
            data: { addedThread },
        });
        response.code(201);
        return response;
    }

    async getThreadHandler(request, h) {
        const { threadId } = request.params;
        const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
        const thread = await detailThreadUseCase.execute(threadId);
        const response = h.response({
            status: 'success',
            data: { thread },
        });
        response.code(200);
        return response;
    }
}

module.exports = ThreadsHandler;
