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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  try {
    const { profileId } = await params;

    if (!profileId) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile ID is required",
        },
        { status: 400 }
      );
    }

    // Get existing AI training data or create default
    let aiTrainingData = mockAITrainingData[profileId];

    if (!aiTrainingData) {
      // Create default AI training data for new profiles
      aiTrainingData = {
        profileId,
        currentScore: 0,
        context: "Valley Sales Strategy",
        messages: [],
        totalMessages: 0,
        lastUpdated: new Date().toISOString(),
      };

      mockAITrainingData[profileId] = aiTrainingData;
    }

    const response: ApiResponse<AITrainingResponse> = {
      data: aiTrainingData,
      success: true,
      message: "AI training data retrieved successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching AI training data:", error);
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
