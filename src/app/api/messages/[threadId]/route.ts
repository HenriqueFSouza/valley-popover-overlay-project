import {
  ApiResponse,
  MessagesResponse,
  MessageThreadResponse,
  UpdateMessageThreadRequest,
} from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

// Mock database - shared with main messages route
const mockThreads: MessageThreadResponse[] = [
  {
    id: "thread_1",
    type: "manual_change",
    fromCampaign: "Campaign name",
    toCampaign: "Prospect name",
    content: "Writing style updated from Campaign name via Prospect name",
    timestamp: "Tue May 15, 9:14 AM",
    participants: ["Andrew", "Sarah"],
    profileId: "profile_1",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "thread_2",
    type: "custom_message",
    fromCampaign: "Campaign name",
    toCampaign: "Prospect name",
    content:
      "Hey Chris, Hope you're having a great week so far! We've got some really exciting about self-custody and shaking off the chains of traditional finance. Check it out. Best regards, Andrew",
    timestamp: "Tue May 15, 9:14 AM (3 days ago)",
    participants: ["Andrew"],
    profileId: "profile_1",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "thread_3",
    type: "message_generated",
    fromCampaign: "Campaign name",
    toCampaign: "Prospect name",
    timestamp: "8 days ago",
    isApproved: true,
    participants: ["Valley Team"],
    profileId: "profile_1",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "thread_4",
    type: "message_rated",
    fromCampaign: "Campaign name",
    toCampaign: "Prospect name",
    timestamp: "8 days ago",
    rating: 4,
    participants: ["James", "Anderson", "Lisa", "Mike", "Alex"],
    profileId: "profile_1",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "thread_5",
    type: "generated_message",
    fromCampaign: "Performance Marketing",
    toCampaign: "Valley",
    content:
      "James Livermore and 45 others have been added to Performance tracking",
    timestamp: "8 days ago",
    participants: ["James", "Anderson", "Lisa", "Mike"],
    profileId: "profile_1",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;

    if (!threadId) {
      return NextResponse.json(
        {
          success: false,
          message: "Thread ID is required",
        },
        { status: 400 }
      );
    }

    const threadIndex = mockThreads.findIndex(
      (thread) => thread.id === threadId
    );

    if (threadIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Message thread not found",
        },
        { status: 404 }
      );
    }

    const updates: UpdateMessageThreadRequest = await request.json();

    // Validate rating if provided
    if (
      updates.rating !== undefined &&
      (updates.rating < 1 || updates.rating > 5)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating must be between 1 and 5",
        },
        { status: 400 }
      );
    }

    // Update the thread
    const updatedThread: MessageThreadResponse = {
      ...mockThreads[threadIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    mockThreads[threadIndex] = updatedThread;

    const messagesResponse: MessagesResponse = {
      threads: mockThreads.slice(0, 10), // Return first 10 for display
      totalThreads: mockThreads.length,
      lastUpdated: new Date().toISOString(),
    };

    const response: ApiResponse<MessagesResponse> = {
      data: messagesResponse,
      success: true,
      message: "Message thread updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating message thread:", error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;

    if (!threadId) {
      return NextResponse.json(
        {
          success: false,
          message: "Thread ID is required",
        },
        { status: 400 }
      );
    }

    const threadIndex = mockThreads.findIndex(
      (thread) => thread.id === threadId
    );

    if (threadIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Message thread not found",
        },
        { status: 404 }
      );
    }

    // Remove the thread
    mockThreads.splice(threadIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Message thread deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message thread:", error);
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
