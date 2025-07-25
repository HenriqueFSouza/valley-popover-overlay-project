import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAITraining,
  useAITrainingActions,
} from "@/hooks/ai-training/useAITraining";
import { useState } from "react";

interface AITrainingProps {
  profileId: string;
}

export default function AITraining({ profileId }: AITrainingProps) {
  const { aiTraining, isLoading, isError, error } = useAITraining(profileId);
  const { createMessage, approveMessage, regenerateMessage } =
    useAITrainingActions();
  const [customMessage, setCustomMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateMessage = async () => {
    if (!customMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await createMessage({
        profileId,
        content: customMessage,
        sender: "You", // This would typically come from user context
      });
      setCustomMessage("");
    } catch (error) {
      console.error("Failed to create message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveMessage = async (messageId: string) => {
    try {
      await approveMessage(profileId, messageId);
    } catch (error) {
      console.error("Failed to approve message:", error);
    }
  };

  const handleRegenerateMessage = async (messageId: string) => {
    try {
      await regenerateMessage(profileId, messageId);
    } catch (error) {
      console.error("Failed to regenerate message:", error);
    }
  };

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">Failed to load AI training data</p>
          <p className="text-gray-500 text-sm">{error?.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Score Display Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <span className="text-sm text-gray-500">●</span>
            <Skeleton className="h-6 w-16" />
          </div>
        </div>

        {/* Messages Skeleton */}
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Section Skeleton */}
        <div className="border-t bg-white/80 p-4 border-gray-100/50 space-y-3">
          <Skeleton className="h-10 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20 ml-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!aiTraining) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No AI training data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Score Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">🔔 Justification</span>
          <span className="text-sm text-gray-500">●</span>
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-200"
          >
            Score: {aiTraining.currentScore}
          </Badge>
        </div>
      </div>

      {/* Conversation Messages */}
      <div className="space-y-3">
        {aiTraining.messages.map((message) => (
          <div key={message.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Avatar className="size-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  {message.sender.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{message.sender}</span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp}
                  </span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {message.content}
                </p>

                <div className="flex items-center gap-2">
                  {!message.isApproved && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproveMessage(message.id)}
                    >
                      ✓ Approve
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerateMessage(message.id)}
                  >
                    🔄 Regenerate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="border-t bg-white/80 p-4 border-gray-100/50 space-y-3">
        <Input
          placeholder="Write a custom message..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="w-full"
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateMessage}
            disabled={!customMessage.trim() || isSubmitting}
          >
            📝 Custom Message
          </Button>
          <Button variant="outline" size="sm">
            🔄 Regenerate
          </Button>
          <Button variant="outline" size="sm">
            Prompt
          </Button>
          <Button className="ml-auto" size="sm" disabled={isSubmitting}>
            ✓ Approve
          </Button>
        </div>
      </div>
    </div>
  );
}
