import {
  AITrainingResponse,
  ApiResponse,
  UpdateAITrainingMessageRequest,
} from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

// Mock database - shared with other AI training routes
const mockAITrainingData: Record<string, AITrainingResponse> = {
  profile_1: {
    profileId: "profile_1",
    currentScore: 24,
    context: "Valley Sales Strategy",
    messages: [
      {
        id: "msg_1",
        sender: "Hey Crew",
        content:
          "Hope you're doing awesome! 🎉 We've got some juicy reads for you about self-custody and shaking off the chains of traditional finance. Check it out.",
        timestamp: "2 mins ago",
        score: 24,
        isApproved: true,
        profileId: "profile_1",
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
      {
        id: "msg_2",
        sender: "Andrew",
        content:
          "Thanks for sharing! I've been looking into DeFi protocols lately and this seems really relevant to our discussion about financial independence.",
        timestamp: "5 mins ago",
        isApproved: false,
        profileId: "profile_1",
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
    ],
    totalMessages: 2,
    lastUpdated: new Date().toISOString(),
  },
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: { profileId: string; messageId: string } }
) {
  try {
    const { profileId, messageId } = params;

    if (!profileId || !messageId) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile ID and Message ID are required",
        },
        { status: 400 }
      );
    }

    const aiTrainingData = mockAITrainingData[profileId];

    if (!aiTrainingData) {
      return NextResponse.json(
        {
          success: false,
          message: "AI training data not found for this profile",
        },
        { status: 404 }
      );
    }

    const messageIndex = aiTrainingData.messages.findIndex(
      (m) => m.id === messageId
    );

    if (messageIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found",
        },
        { status: 404 }
      );
    }

    const updates: UpdateAITrainingMessageRequest = await request.json();

    // Update the message
    const updatedMessage = {
      ...aiTrainingData.messages[messageIndex],
      ...updates,
    };

    // Update the messages array
    const updatedMessages = [...aiTrainingData.messages];
    updatedMessages[messageIndex] = updatedMessage;

    // Update AI training data
    const updatedAITraining: AITrainingResponse = {
      ...aiTrainingData,
      messages: updatedMessages,
      lastUpdated: new Date().toISOString(),
    };

    mockAITrainingData[profileId] = updatedAITraining;

    const response: ApiResponse<AITrainingResponse> = {
      data: updatedAITraining,
      success: true,
      message: "Message updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating AI training message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
