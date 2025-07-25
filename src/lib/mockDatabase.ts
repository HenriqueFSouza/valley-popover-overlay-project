import {
  AITrainingResponse,
  MessageThreadResponse,
  ProfileResponse,
} from "@/types/api";

// Centralized mock database for development
class MockDatabase {
  private profiles: Record<string, ProfileResponse> = {
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

  private aiTrainingData: Record<string, AITrainingResponse> = {
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

  private messageThreads: MessageThreadResponse[] = [
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

  // Profile methods
  getProfile(profileId: string): ProfileResponse | null {
    return this.profiles[profileId] || null;
  }

  updateProfile(
    profileId: string,
    updates: Partial<ProfileResponse>
  ): ProfileResponse | null {
    const existing = this.profiles[profileId];
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      id: profileId, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString(),
    };

    this.profiles[profileId] = updated;
    return updated;
  }

  // AI Training methods
  getAITraining(profileId: string): AITrainingResponse {
    if (!this.aiTrainingData[profileId]) {
      // Create default for new profiles
      this.aiTrainingData[profileId] = {
        profileId,
        currentScore: 0,
        context: "Valley Sales Strategy",
        messages: [],
        totalMessages: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
    return this.aiTrainingData[profileId];
  }

  updateAITraining(
    profileId: string,
    data: AITrainingResponse
  ): AITrainingResponse {
    this.aiTrainingData[profileId] = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    return this.aiTrainingData[profileId];
  }

  // Message Thread methods
  getMessageThreads(): MessageThreadResponse[] {
    return [...this.messageThreads]; // Return copy to prevent mutation
  }

  getMessageThread(threadId: string): MessageThreadResponse | null {
    return this.messageThreads.find((thread) => thread.id === threadId) || null;
  }

  addMessageThread(thread: MessageThreadResponse): MessageThreadResponse {
    this.messageThreads.unshift(thread); // Add to beginning
    return thread;
  }

  updateMessageThread(
    threadId: string,
    updates: Partial<MessageThreadResponse>
  ): MessageThreadResponse | null {
    const index = this.messageThreads.findIndex(
      (thread) => thread.id === threadId
    );
    if (index === -1) return null;

    const updated = {
      ...this.messageThreads[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.messageThreads[index] = updated;
    return updated;
  }

  deleteMessageThread(threadId: string): boolean {
    const index = this.messageThreads.findIndex(
      (thread) => thread.id === threadId
    );
    if (index === -1) return false;

    this.messageThreads.splice(index, 1);
    return true;
  }

  filterMessageThreads(filters: {
    profileId?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): { threads: MessageThreadResponse[]; total: number } {
    let filtered = [...this.messageThreads];

    if (filters.profileId) {
      filtered = filtered.filter(
        (thread) => thread.profileId === filters.profileId
      );
    }

    if (filters.type) {
      filtered = filtered.filter((thread) => thread.type === filters.type);
    }

    const total = filtered.length;

    if (filters.page && filters.limit) {
      const startIndex = (filters.page - 1) * filters.limit;
      const endIndex = startIndex + filters.limit;
      filtered = filtered.slice(startIndex, endIndex);
    }

    return { threads: filtered, total };
  }
}

// Export singleton instance
export const mockDB = new MockDatabase();
export default mockDB;
