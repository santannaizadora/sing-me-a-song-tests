import { jest } from '@jest/globals';
import { recommendationService } from '../../src/services/recommendationsService.js';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import recommendationBody from '../factories/recommendationBody.js';
import recommendations from '../factories/recommendations.js';
import mockMathRandom from '../utils/mockMathRandom.js';

describe('recommendationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a recommendation', async () => {
    const RecommendationData = recommendationBody();

    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockImplementationOnce(null);
    jest.spyOn(recommendationRepository, 'create').mockImplementationOnce(null);

    const result = await recommendationService.insert(RecommendationData[0]);

    expect(result).toBe(undefined);
  });

  it('should conflict creating recommendation', async () => {
    const recommendation = recommendations();

    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockResolvedValueOnce(recommendation[0]);

    expect(recommendationService.insert(recommendation[0])).rejects.toEqual({
      message: 'Recommendations names must be unique',
      type: 'conflict',
    });
  });

  it('should upvote', async () => {
    const recommendation = recommendations();

    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(recommendation[0]);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValueOnce(recommendation[0]);

    const result = await recommendationService.upvote(recommendation[0].id);

    expect(result).toBe(undefined);
  });

  it('should not found recommendation upvote', async () => {
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

    expect(recommendationService.upvote(1)).rejects.toEqual({
      message: '',
      type: 'not_found',
    });
  });

  it('should remove a upvote', async () => {
    const recommendation = recommendations();

    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(recommendation[0]);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValueOnce(recommendation[0]);
    jest.spyOn(recommendationRepository, 'remove').mockResolvedValueOnce(null);

    const result = await recommendationService.downvote(recommendation[0].id);

    expect(result).toBe(undefined);
  });

  it('should downvote a recommendation', async () => {
    const recommendation = recommendations();

    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(recommendation[0]);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValueOnce(recommendation[0]);

    const result = await recommendationService.downvote(recommendation[0].id);

    expect(result).toBe(undefined);
  });

  it('should not found recommendation downvote', async () => {
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

    expect(recommendationService.downvote(1)).rejects.toEqual({
      message: '',
      type: 'not_found',
    });
  });

  it('should remove downvote', async () => {
    const recommendation = recommendations();

    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(recommendation[0]);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValueOnce(recommendation[0]);
    jest.spyOn(recommendationRepository, 'remove').mockResolvedValueOnce(null);

    const result = await recommendationService.downvote(recommendation[0].id);

    expect(result).toBe(undefined);
  });

  it('should get all recommendations', async () => {
    const recommendation = recommendations();

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValueOnce(recommendation);

    const result = await recommendationService.get();

    expect(result).toEqual(recommendation);
  });

  it('should get a recommendation by id', async () => {
    const recommendation = recommendations();

    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(recommendation[0]);

    const result = await recommendationService.getById(recommendation[0].id);

    expect(result).toEqual(recommendation[0]);
  });

  it('should not found recommendation by id', async () => {
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

    expect(recommendationService.getById(1)).rejects.toEqual({
      message: '',
      type: 'not_found',
    });
  });
  it('should remove a recommendation with negative score', async () => {
    const recommendation = recommendations();

    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(recommendation[2]);
    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValueOnce(recommendation[2]);
    jest.spyOn(recommendationRepository, 'remove').mockResolvedValueOnce(null);

    const result = await recommendationService.downvote(recommendation[2].id);

    expect(result).toBe(undefined);
  });
  it('should get top recommendation', async () => {
    const recommendation = recommendations();

    jest
      .spyOn(recommendationRepository, 'getAmountByScore')
      .mockResolvedValueOnce(recommendation);

    const result = await recommendationService.getTop(523);

    expect(result).toEqual(recommendation);
  });

  it('should getRandom', async () => {
    mockMathRandom(0.5);

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValue(recommendations());

    const result = await recommendationService.getRandom();

    expect(result).toEqual(recommendations()[1]);
  });

  it('should not found recommendation getRandom', async () => {
    mockMathRandom(1);

    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([]);

    expect(async () => {
      await recommendationService.getRandom();
    }).rejects.toEqual({ message: '', type: 'not_found' });
  });
});
