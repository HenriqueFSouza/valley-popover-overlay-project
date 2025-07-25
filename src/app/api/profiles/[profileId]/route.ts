import { ApiResponse, ProfileResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

// Mock database - in real app, this would be replaced with actual database
const mockProfiles: Record<string, ProfileResponse> = {
  profile_1: {
    id: "profile_1",
    name: "John Anderson",
    title: "Senior Marketing Director",
    avatar: "/api/placeholder/32/32",
    score: "85",
    campaign: "Valley Sales Strategy",
    status: "Approved",
    tags: ["Marketing", "B2B", "SaaS"],
    privacy: "Public Profile",
    linkedin: "https://linkedin.com/in/johnanderson",
    email: "john.anderson@company.com",
    address: "San Francisco, CA",
    intentData: {},
    experience: {},
    education: {},
    linkedinBio: "Experienced marketing director with 10+ years in B2B SaaS",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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

    const profile = mockProfiles[profileId];

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile not found",
        },
        { status: 404 }
      );
    }

    const response: ApiResponse<ProfileResponse> = {
      data: profile,
      success: true,
      message: "Profile retrieved successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching profile:", error);
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

export async function PATCH(
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

    const existingProfile = mockProfiles[profileId];

    if (!existingProfile) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile not found",
        },
        { status: 404 }
      );
    }

    const updates = await request.json();

    // Validate updates (basic validation)
    if (updates.email && !isValidEmail(updates.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Update profile
    const updatedProfile: ProfileResponse = {
      ...existingProfile,
      ...updates,
      id: profileId, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString(),
    };

    mockProfiles[profileId] = updatedProfile;

    const response: ApiResponse<ProfileResponse> = {
      data: updatedProfile,
      success: true,
      message: "Profile updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating profile:", error);
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

// Utility function for email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
