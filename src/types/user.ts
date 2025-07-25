export interface UserProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  score?: string;
  campaign: string;
  status: ProfileStatus;
  tags: string[];
  privacy: "Public Profile" | "Private Profile";
  linkedin: string;
  email: string;
  address: string;
  intentData?: unknown;
  experience?: unknown;
  education?: unknown;
  linkedinBio?: string;
}

export enum ProfileStatus {
  APPROVAL_REQUIRED = "Approval Required",
  APPROVED = "Approved",
  PENDING = "Pending",
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  currentIndex: number;
  totalCount: number;
  context: string;
}
