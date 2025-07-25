import {
  ApiError,
  ApiResponse,
  CreateMessageThreadRequest,
  MessagesResponse,
  PaginationParams,
  UpdateMessageThreadRequest,
} from "@/types/api";

interface GetMessagesParams extends PaginationParams {
  profileId?: string;
  type?: string;
}

class MessageService {
  private baseUrl = "/api/messages";

  async getMessages(params: GetMessagesParams = {}): Promise<MessagesResponse> {
    try {
      const searchParams = new URLSearchParams();

      if (params.profileId) searchParams.append("profileId", params.profileId);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.type) searchParams.append("type", params.type);
      if (params.cursor) searchParams.append("cursor", params.cursor);

      const url = `${this.baseUrl}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for performance
        next: { revalidate: 120 }, // Cache for 2 minutes
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<MessagesResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch messages");
      }

      return data.data;
    } catch (error) {
      console.error("MessageService.getMessages error:", error);
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred while fetching messages");
    }
  }

  async createThread(
    threadData: CreateMessageThreadRequest
  ): Promise<MessagesResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(threadData),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<MessagesResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create message thread");
      }

      return data.data;
    } catch (error) {
      console.error("MessageService.createThread error:", error);
      throw error instanceof Error
        ? error
        : new Error(
            "An unexpected error occurred while creating message thread"
          );
    }
  }

  async updateThread(
    threadId: string,
    updates: UpdateMessageThreadRequest
  ): Promise<MessagesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${threadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<MessagesResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update message thread");
      }

      return data.data;
    } catch (error) {
      console.error("MessageService.updateThread error:", error);
      throw error instanceof Error
        ? error
        : new Error(
            "An unexpected error occurred while updating message thread"
          );
    }
  }

  async rateMessage(
    threadId: string,
    rating: number
  ): Promise<MessagesResponse> {
    return this.updateThread(threadId, { rating });
  }

  async approveMessage(threadId: string): Promise<MessagesResponse> {
    return this.updateThread(threadId, { isApproved: true });
  }

  async deleteThread(threadId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${threadId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
    } catch (error) {
      console.error("MessageService.deleteThread error:", error);
      throw error instanceof Error
        ? error
        : new Error(
            "An unexpected error occurred while deleting message thread"
          );
    }
  }

  // Helper method to get messages by profile
  async getMessagesByProfile(
    profileId: string,
    params: PaginationParams = {}
  ): Promise<MessagesResponse> {
    return this.getMessages({ ...params, profileId });
  }

  // Helper method to get messages by type
  async getMessagesByType(
    type: string,
    params: PaginationParams = {}
  ): Promise<MessagesResponse> {
    return this.getMessages({ ...params, type });
  }
}

// Export singleton instance
export const messageService = new MessageService();
export default messageService;
