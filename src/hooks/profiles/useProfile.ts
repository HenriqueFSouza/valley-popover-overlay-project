import { profileService } from "@/services/profiles/profileService";
import { ProfileResponse } from "@/types/api";
import useSWR, { mutate } from "swr";

interface UseProfileResult {
  profile: ProfileResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  mutate: () => void;
  isValidating: boolean;
}

export function useProfile(profileId: string | null): UseProfileResult {
  const {
    data: profile,
    error,
    isLoading,
    isValidating,
    mutate: mutateProfile,
  } = useSWR<ProfileResponse | undefined>(
    profileId ? `/api/profiles/${profileId}` : null,
    () => (profileId ? profileService.getProfile(profileId) : undefined),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      onError: (error) => {
        console.error("Profile fetch error:", error);
      },
    }
  );

  return {
    profile,
    isLoading,
    isError: !!error,
    error,
    mutate: mutateProfile,
    isValidating,
  };
}

// Hook for updating profile
export function useUpdateProfile() {
  const updateProfile = async (
    profileId: string,
    updates: Partial<ProfileResponse>
  ) => {
    try {
      const updatedProfile = await profileService.updateProfile(
        profileId,
        updates
      );
      // Revalidate the specific profile cache
      await mutate(`/api/profiles/${profileId}`, updatedProfile, false);
      return updatedProfile;
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  return { updateProfile };
}
