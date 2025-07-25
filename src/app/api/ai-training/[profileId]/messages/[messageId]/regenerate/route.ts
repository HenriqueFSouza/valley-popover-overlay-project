import { AITrainingResponse, ApiResponse } from "@/types/api";
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

// Sample regenerated content for demo
const regeneratedContent = [
  "Here's an updated perspective on DeFi and financial independence that might interest you.",
  "I've refined my thoughts on blockchain technology and self-custody solutions.",
  "Let me share some enhanced insights about decentralized finance trends.",
  "Here's a fresh take on the evolving crypto landscape and its implications.",
];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string; messageId: string }> }
) {
  try {
    const { profileId, messageId } = await params;

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

    // Simulate AI regeneration by picking random content
    const randomContent =
      regeneratedContent[Math.floor(Math.random() * regeneratedContent.length)];

    // Update the message with regenerated content
    const updatedMessage = {
      ...aiTrainingData.messages[messageIndex],
      content: randomContent,
      timestamp: "just now",
      isApproved: false, // Reset approval status for regenerated content
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
      message: "Message regenerated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error regenerating AI training message:", error);
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
