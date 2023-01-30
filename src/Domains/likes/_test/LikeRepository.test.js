const LikeRepository = require('../LikeRepository');

describe('LikeRepository interface', () => {
    it('should throw error when invoke abstract behaviour', async () => {
        const likeRepository = new LikeRepository();

        await expect(likeRepository.addLike({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeRepository.verifyLikeIsExist('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeRepository.deleteLike('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(likeRepository.getCountLike('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
