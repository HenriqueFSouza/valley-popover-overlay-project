import {
  AITrainingResponse,
  ApiError,
  ApiResponse,
  CreateAITrainingMessageRequest,
  UpdateAITrainingMessageRequest,
} from "@/types/api";

class AITrainingService {
  private baseUrl = "/api/ai-training";

  async getAITrainingData(profileId: string): Promise<AITrainingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${profileId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for performance
        next: { revalidate: 60 }, // Cache for 1 minute (AI training data changes more frequently)
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<AITrainingResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch AI training data");
      }

      return data.data;
    } catch (error) {
      console.error("AITrainingService.getAITrainingData error:", error);
      throw error instanceof Error
        ? error
        : new Error(
            "An unexpected error occurred while fetching AI training data"
          );
    }
  }

  async createMessage(
    messageData: CreateAITrainingMessageRequest
  ): Promise<AITrainingResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${messageData.profileId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        }
      );

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<AITrainingResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create message");
      }

      return data.data;
    } catch (error) {
      console.error("AITrainingService.createMessage error:", error);
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred while creating message");
    }
  }

  async updateMessage(
    profileId: string,
    messageId: string,
    updates: UpdateAITrainingMessageRequest
  ): Promise<AITrainingResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${profileId}/messages/${messageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<AITrainingResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update message");
      }

      return data.data;
    } catch (error) {
      console.error("AITrainingService.updateMessage error:", error);
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred while updating message");
    }
  }

  async approveMessage(
    profileId: string,
    messageId: string
  ): Promise<AITrainingResponse> {
    return this.updateMessage(profileId, messageId, { isApproved: true });
  }

  async regenerateMessage(
    profileId: string,
    messageId: string
  ): Promise<AITrainingResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${profileId}/messages/${messageId}/regenerate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<AITrainingResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to regenerate message");
      }

      return data.data;
    } catch (error) {
      console.error("AITrainingService.regenerateMessage error:", error);
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred while regenerating message");
    }
  }
}

// Export singleton instance
export const aiTrainingService = new AITrainingService();
export default aiTrainingService;
