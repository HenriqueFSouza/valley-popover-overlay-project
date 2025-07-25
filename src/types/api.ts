// Base API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
    cursor?: string;
  };
}

// Profile API Types
export interface ProfileResponse {
  id: string;
  name: string;
  title: string;
  avatar: string;
  score?: string;
  icpFit?: string;
  campaign: string;
  status: string;
  tags: string[];
  privacy: string;
  linkedin: string;
  email: string;
  address: string;
  intentData?: unknown;
  experience?: unknown;
  education?: unknown;
  linkedinBio?: string;
  createdAt: string;
  updatedAt: string;
}

// AI Training API Types
export interface AITrainingResponse {
  profileId: string;
  currentScore: number;
  context: string;
  messages: AITrainingMessageResponse[];
  totalMessages: number;
  lastUpdated: string;
}

export interface AITrainingMessageResponse {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  score?: number;
  isApproved?: boolean;
  profileId: string;
  createdAt: string;
}

// Messages API Types
export interface MessagesResponse {
  threads: MessageThreadResponse[];
  totalThreads: number;
  lastUpdated: string;
}

export interface MessageThreadResponse {
  id: string;
  type:
    | "manual_change"
    | "custom_message"
    | "generated_message"
    | "message_rated"
    | "message_generated";
  fromCampaign: string;
  toCampaign: string;
  content?: string;
  timestamp: string;
  rating?: number;
  participants?: string[];
  isApproved?: boolean;
  profileId?: string;
  createdAt: string;
  updatedAt: string;
}

// Request Types
export interface CreateAITrainingMessageRequest {
  profileId: string;
  content: string;
  sender: string;
}

export interface UpdateAITrainingMessageRequest {
  isApproved?: boolean;
  score?: number;
}

export interface CreateMessageThreadRequest {
  type: MessageThreadResponse["type"];
  fromCampaign: string;
  toCampaign: string;
  content?: string;
  profileId?: string;
}

export interface UpdateMessageThreadRequest {
  rating?: number;
  isApproved?: boolean;
  content?: string;
}
