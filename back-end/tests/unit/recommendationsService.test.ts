import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";

describe("recommendationService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should create a recommendation", async () => {
        const createRecommendationData = {
            name: "Test",
            youtubeLink: "https://www.youtube.com/watch?v=12345",
        };

        jest.spyOn(recommendationRepository, "findByName").mockResolvedValue(null);
        jest.spyOn(recommendationRepository, "create").mockResolvedValue(null);

        await recommendationService.insert(createRecommendationData);

        expect(recommendationRepository.findByName).toHaveBeenCalledTimes(1);
        expect(recommendationRepository.findByName).toHaveBeenCalledWith(createRecommendationData.name);
        expect(recommendationRepository.create).toHaveBeenCalledTimes(1);
        expect(recommendationRepository.create).toHaveBeenCalledWith(createRecommendationData);
    });
});