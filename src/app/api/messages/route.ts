import {
  ApiResponse,
  CreateMessageThreadRequest,
  MessagesResponse,
  MessageThreadResponse,
} from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

// Mock database - would be replaced with actual database
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");

    // Filter by profileId if provided
    let filteredThreads = profileId
      ? mockThreads.filter((thread) => thread.profileId === profileId)
      : mockThreads;

    // Filter by type if provided
    if (type) {
      filteredThreads = filteredThreads.filter(
        (thread) => thread.type === type
      );
    }

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedThreads = filteredThreads.slice(startIndex, endIndex);

    const messagesResponse: MessagesResponse = {
      threads: paginatedThreads,
      totalThreads: filteredThreads.length,
      lastUpdated: new Date().toISOString(),
    };

    const response: ApiResponse<MessagesResponse> = {
      data: messagesResponse,
      success: true,
      message: "Messages retrieved successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching messages:", error);
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

export async function POST(request: NextRequest) {
  try {
    const body: CreateMessageThreadRequest = await request.json();

    // Validate required fields
    if (!body.type || !body.fromCampaign || !body.toCampaign) {
      return NextResponse.json(
        {
          success: false,
          message: "Type, fromCampaign, and toCampaign are required",
        },
        { status: 400 }
      );
    }

    // Create new thread
    const newThread: MessageThreadResponse = {
      id: `thread_${Date.now()}`,
      type: body.type,
      fromCampaign: body.fromCampaign,
      toCampaign: body.toCampaign,
      content: body.content,
      timestamp: "just now",
      profileId: body.profileId || "profile_1",
      participants: ["Current User"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock database
    mockThreads.unshift(newThread); // Add to beginning for latest-first order

    const messagesResponse: MessagesResponse = {
      threads: mockThreads.slice(0, 10), // Return first 10 for display
      totalThreads: mockThreads.length,
      lastUpdated: new Date().toISOString(),
    };

    const response: ApiResponse<MessagesResponse> = {
      data: messagesResponse,
      success: true,
      message: "Message thread created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating message thread:", error);
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
