import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMessageActions, useMessages } from "@/hooks/messages/useMessages";
import { MessageThreadResponse } from "@/types/api";

interface MessagesProps {
  profileId?: string;
}

function MessageTypeIcon({ type }: { type: MessageThreadResponse["type"] }) {
  switch (type) {
    case "manual_change":
      return <span className="text-blue-500">🔄</span>;
    case "custom_message":
      return <span className="text-green-500">💬</span>;
    case "generated_message":
      return <span className="text-purple-500">🤖</span>;
    case "message_rated":
      return <span className="text-yellow-500">⭐</span>;
    case "message_generated":
      return <span className="text-indigo-500">✨</span>;
    default:
      return <span className="text-gray-500">📝</span>;
  }
}

function StarRating({
  rating,
  threadId,
}: {
  rating?: number;
  threadId: string;
}) {
  const { rateMessage } = useMessageActions();

  const handleRating = async (newRating: number) => {
    try {
      await rateMessage(threadId, newRating);
    } catch (error) {
      console.error("Failed to rate message:", error);
    }
  };

  if (!rating && !threadId) return null;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRating(star)}
          className={`text-xs cursor-pointer hover:scale-110 transition-transform ${
            star <= (rating || 0) ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ParticipantAvatars({ participants }: { participants?: string[] }) {
  if (!participants) return null;

  return (
    <div className="flex -space-x-1">
      {participants.slice(0, 3).map((participant, index) => (
        <Avatar key={index} className="size-6 border-2 border-white">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
            {participant.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {participants.length > 3 && (
        <div className="size-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
          <span className="text-xs text-gray-600">
            +{participants.length - 3}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Messages({ profileId }: MessagesProps) {
  const { messages, isLoading, isError, error } = useMessages({ profileId });
  const { approveMessage } = useMessageActions();

  const handleApproveMessage = async (threadId: string) => {
    try {
      await approveMessage(threadId);
    } catch (error) {
      console.error("Failed to approve message:", error);
    }
  };

  const getMessageDescription = (thread: MessageThreadResponse) => {
    switch (thread.type) {
      case "manual_change":
        return "Manual changes";
      case "custom_message":
        return "Custom message";
      case "generated_message":
        return "Message generated";
      case "message_rated":
        return "Message rated";
      case "message_generated":
        return "Message generated";
      default:
        return "Message";
    }
  };

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">Failed to load messages</p>
          <p className="text-gray-500 text-sm">{error?.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Message Threads Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100"
            >
              <Skeleton className="size-6 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
                {Math.random() > 0.5 && <Skeleton className="h-8 w-full" />}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Skeleton */}
        <div className="text-center py-4">
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (!messages || messages.threads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No messages available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>Included</span>
          <span>Excluded</span>
          <span>Types</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🏷️ ZeptQ Writing Style</span>
        </div>
      </div>

      {/* Message Threads */}
      <div className="space-y-3">
        {messages.threads.map((thread) => (
          <div
            key={thread.id}
            className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div className="flex-shrink-0 pt-1">
              <MessageTypeIcon type={thread.type} />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">
                    {getMessageDescription(thread)}
                  </span>
                  <span className="text-gray-400">from</span>
                  <span className="font-medium text-blue-600">
                    {thread.fromCampaign}
                  </span>
                  <span className="text-gray-400">to</span>
                  <span className="font-medium text-blue-600">
                    {thread.toCampaign}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {thread.timestamp}
                </span>
              </div>

              {thread.content && (
                <p className="text-sm text-gray-700">{thread.content}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {thread.rating && (
                    <StarRating rating={thread.rating} threadId={thread.id} />
                  )}
                  <ParticipantAvatars participants={thread.participants} />
                </div>

                <div className="flex items-center gap-2">
                  {thread.isApproved ? (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      ✓ Generated message
                    </Badge>
                  ) : (
                    <button
                      onClick={() => handleApproveMessage(thread.id)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">
          Showing {messages.threads.length} of {messages.totalThreads} messages.
          Prompt to train messaging style.
        </p>
      </div>
    </div>
  );
}
