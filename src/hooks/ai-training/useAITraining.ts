import { aiTrainingService } from "@/services/ai-training/aiTrainingService";
import {
  AITrainingResponse,
  CreateAITrainingMessageRequest,
  UpdateAITrainingMessageRequest,
} from "@/types/api";
import useSWR, { mutate } from "swr";

interface UseAITrainingResult {
  aiTraining: AITrainingResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  mutate: () => void;
  isValidating: boolean;
}

export function useAITraining(profileId: string | null): UseAITrainingResult {
  const {
    data: aiTraining,
    error,
    isLoading,
    isValidating,
    mutate: mutateAITraining,
  } = useSWR<AITrainingResponse | undefined>(
    profileId ? `/api/ai-training/${profileId}` : null,
    () =>
      profileId ? aiTrainingService.getAITrainingData(profileId) : undefined,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute (AI training data changes more frequently)
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      onError: (error) => {
        console.error("AI Training fetch error:", error);
      },
    }
  );

  return {
    aiTraining,
    isLoading,
    isError: !!error,
    error,
    mutate: mutateAITraining,
    isValidating,
  };
}

// Hook for managing AI training messages
export function useAITrainingActions() {
  const createMessage = async (messageData: CreateAITrainingMessageRequest) => {
    try {
      const updatedTraining = await aiTrainingService.createMessage(
        messageData
      );
      // Revalidate the AI training cache
      await mutate(
        `/api/ai-training/${messageData.profileId}`,
        updatedTraining,
        false
      );
      return updatedTraining;
    } catch (error) {
      console.error("Create AI training message error:", error);
      throw error;
    }
  };

  const updateMessage = async (
    profileId: string,
    messageId: string,
    updates: UpdateAITrainingMessageRequest
  ) => {
    try {
      const updatedTraining = await aiTrainingService.updateMessage(
        profileId,
        messageId,
        updates
      );
      // Revalidate the AI training cache
      await mutate(`/api/ai-training/${profileId}`, updatedTraining, false);
      return updatedTraining;
    } catch (error) {
      console.error("Update AI training message error:", error);
      throw error;
    }
  };

  const approveMessage = async (profileId: string, messageId: string) => {
    try {
      const updatedTraining = await aiTrainingService.approveMessage(
        profileId,
        messageId
      );
      // Revalidate the AI training cache
      await mutate(`/api/ai-training/${profileId}`, updatedTraining, false);
      return updatedTraining;
    } catch (error) {
      console.error("Approve AI training message error:", error);
      throw error;
    }
  };

  const regenerateMessage = async (profileId: string, messageId: string) => {
    try {
      const updatedTraining = await aiTrainingService.regenerateMessage(
        profileId,
        messageId
      );
      // Revalidate the AI training cache
      await mutate(`/api/ai-training/${profileId}`, updatedTraining, false);
      return updatedTraining;
    } catch (error) {
      console.error("Regenerate AI training message error:", error);
      throw error;
    }
  };

  return {
    createMessage,
    updateMessage,
    approveMessage,
    regenerateMessage,
  };
}
