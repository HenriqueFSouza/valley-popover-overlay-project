import { messageService } from "@/services/messages/messageService";
import {
  CreateMessageThreadRequest,
  MessagesResponse,
  PaginationParams,
  UpdateMessageThreadRequest,
} from "@/types/api";
import useSWR, { mutate } from "swr";

interface GetMessagesParams extends PaginationParams {
  profileId?: string;
  type?: string;
}

interface UseMessagesResult {
  messages: MessagesResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  mutate: () => void;
  isValidating: boolean;
}

export function useMessages(params: GetMessagesParams = {}): UseMessagesResult {
  // Create a stable cache key from parameters
  const cacheKey = `/api/messages?${new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString()}`;

  const {
    data: messages,
    error,
    isLoading,
    isValidating,
    mutate: mutateMessages,
  } = useSWR<MessagesResponse | undefined>(
    cacheKey,
    () => messageService.getMessages(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 120000, // 2 minutes
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      onError: (error) => {
        console.error("Messages fetch error:", error);
      },
    }
  );

  return {
    messages,
    isLoading,
    isError: !!error,
    error,
    mutate: mutateMessages,
    isValidating,
  };
}

// Hook for messages by profile
export function useMessagesByProfile(
  profileId: string | null,
  params: PaginationParams = {}
) {
  return useMessages(profileId ? { ...params, profileId } : {});
}

// Hook for messages by type
export function useMessagesByType(
  type: string | null,
  params: PaginationParams = {}
) {
  return useMessages(type ? { ...params, type } : {});
}

// Hook for managing message threads
export function useMessageActions() {
  const createThread = async (threadData: CreateMessageThreadRequest) => {
    try {
      const updatedMessages = await messageService.createThread(threadData);
      // Revalidate all message caches
      await mutate(
        (key) => typeof key === "string" && key.startsWith("/api/messages"),
        undefined,
        { revalidate: true }
      );
      return updatedMessages;
    } catch (error) {
      console.error("Create message thread error:", error);
      throw error;
    }
  };

  const updateThread = async (
    threadId: string,
    updates: UpdateMessageThreadRequest
  ) => {
    try {
      const updatedMessages = await messageService.updateThread(
        threadId,
        updates
      );
      // Revalidate all message caches
      await mutate(
        (key) => typeof key === "string" && key.startsWith("/api/messages"),
        undefined,
        { revalidate: true }
      );
      return updatedMessages;
    } catch (error) {
      console.error("Update message thread error:", error);
      throw error;
    }
  };

  const rateMessage = async (threadId: string, rating: number) => {
    try {
      const updatedMessages = await messageService.rateMessage(
        threadId,
        rating
      );
      // Revalidate all message caches
      await mutate(
        (key) => typeof key === "string" && key.startsWith("/api/messages"),
        undefined,
        { revalidate: true }
      );
      return updatedMessages;
    } catch (error) {
      console.error("Rate message error:", error);
      throw error;
    }
  };

  const approveMessage = async (threadId: string) => {
    try {
      const updatedMessages = await messageService.approveMessage(threadId);
      // Revalidate all message caches
      await mutate(
        (key) => typeof key === "string" && key.startsWith("/api/messages"),
        undefined,
        { revalidate: true }
      );
      return updatedMessages;
    } catch (error) {
      console.error("Approve message error:", error);
      throw error;
    }
  };

  const deleteThread = async (threadId: string) => {
    try {
      await messageService.deleteThread(threadId);
      // Revalidate all message caches
      await mutate(
        (key) => typeof key === "string" && key.startsWith("/api/messages"),
        undefined,
        { revalidate: true }
      );
    } catch (error) {
      console.error("Delete message thread error:", error);
      throw error;
    }
  };

  return {
    createThread,
    updateThread,
    rateMessage,
    approveMessage,
    deleteThread,
  };
}
