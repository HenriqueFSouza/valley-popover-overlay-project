import {
  AITrainingMessageResponse,
  AITrainingResponse,
  ApiResponse,
  CreateAITrainingMessageRequest,
} from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

// Mock database - would be replaced with actual database
const mockAITrainingData: Record<string, AITrainingResponse> = {};

export async function POST(
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

    const body: CreateAITrainingMessageRequest = await request.json();

    // Validate request body
    if (!body.content || !body.sender) {
      return NextResponse.json(
        {
          success: false,
          message: "Content and sender are required",
        },
        { status: 400 }
      );
    }

    // Get existing AI training data or create new
    let aiTrainingData = mockAITrainingData[profileId];

    if (!aiTrainingData) {
      aiTrainingData = {
        profileId,
        currentScore: 0,
        context: "Valley Sales Strategy",
        messages: [],
        totalMessages: 0,
        lastUpdated: new Date().toISOString(),
      };
    }

    // Create new message
    const newMessage: AITrainingMessageResponse = {
      id: `msg_${Date.now()}`,
      sender: body.sender,
      content: body.content,
      timestamp: "now",
      profileId,
      createdAt: new Date().toISOString(),
      isApproved: false,
    };

    // Update AI training data
    const updatedAITraining: AITrainingResponse = {
      ...aiTrainingData,
      messages: [...aiTrainingData.messages, newMessage],
      totalMessages: aiTrainingData.messages.length + 1,
      lastUpdated: new Date().toISOString(),
    };

    mockAITrainingData[profileId] = updatedAITraining;

    const response: ApiResponse<AITrainingResponse> = {
      data: updatedAITraining,
      success: true,
      message: "Message created successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating AI training message:", error);
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
