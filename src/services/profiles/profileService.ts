import { ApiError, ApiResponse, ProfileResponse } from "@/types/api";

class ProfileService {
  private baseUrl = "/api/profiles";

  async getProfile(profileId: string): Promise<ProfileResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${profileId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for performance
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse<ProfileResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      return data.data;
    } catch (error) {
      console.error("ProfileService.getProfile error:", error);
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred while fetching profile");
    }
  }

  async updateProfile(
    profileId: string,
    updates: Partial<ProfileResponse>
  ): Promise<ProfileResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${profileId}`, {
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

      const data: ApiResponse<ProfileResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      return data.data;
    } catch (error) {
      console.error("ProfileService.updateProfile error:", error);
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred while updating profile");
    }
  }
}

// Export singleton instance
export const profileService = new ProfileService();
export default profileService;
