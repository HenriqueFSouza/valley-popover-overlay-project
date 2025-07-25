import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/profiles/useProfile";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import {
  FileText,
  Linkedin,
  Lock,
  Mail,
  Map,
  Plus,
  SquareUser,
  Tag,
  Target,
} from "lucide-react";

interface ProfileSectionProps {
  profileId: string;
}

export default function ProfileSection({ profileId }: ProfileSectionProps) {
  const { profile, isLoading, isError, error } = useProfile(profileId);

  const getStatusVariantClass = (status: string) => {
    switch (status) {
      case "Approval Required":
        return "bg-red-200 border-red-300 text-red-700 border-dashed text-xs";
      default:
        return "bg-zinc-200 border-zinc-300 border-dashed text-xs";
    }
  };

  if (isError) {
    return (
      <div className="w-full flex flex-col gap-6 bg-white border border-gray-200 rounded-sm p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">Failed to load profile</p>
          <p className="text-gray-500 text-sm">{error?.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6 bg-white border border-gray-200 rounded-sm p-6">
        {/* Profile Header Skeleton */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="absolute -bottom-1 translate-x-1/2">
              <Skeleton className="h-5 w-8" />
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Details Section Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full flex flex-col gap-6 bg-white border border-gray-200 rounded-sm p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No profile data available</p>
        </div>
      </div>
    );
  }

  // Parse tags from the profile if they're stored as a string
  const profileTags = Array.isArray(profile.tags) ? profile.tags : [];

  return (
    <div className="w-full flex flex-col gap-6 bg-white border border-gray-200 rounded-sm p-6">
      {/* Profile Header */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar className="h-14 w-14">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="text-lg font-semibold">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {profile.score && (
            <div className="absolute -bottom-1 translate-x-1/2">
              <Badge
                variant="outline"
                className="bg-green-600 text-white border-green-600 text-xs font-medium px-1.5 py-0.5"
              >
                {profile.score}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 leading-tight">
            {profile.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{profile.title}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-4">
        {/* ICP-Fit - Prominent Display */}
        <DetailRow
          icon={<SquareUser className="h-4 w-4" />}
          label="ICP-Fit"
          value={
            <Badge
              variant="outline"
              className="bg-zinc-100 border-zinc-300 border-dashed text-xs font-thin"
            >
              <SquareUser className="size-2 text-zinc-500" />
              {profile.icpFit}
            </Badge>
          }
        />
        {/* Campaign */}
        <DetailRow
          icon={<Target className="h-4 w-4" />}
          label="Campaign"
          value={
            <span className="text-gray-900 font-medium">
              {profile.campaign}
            </span>
          }
        />

        {/* Status */}
        <DetailRow
          icon={<FileText className="h-4 w-4" />}
          label="Status"
          value={
            <Badge
              className={cn(
                "font-medium text-xs",
                getStatusVariantClass(profile.status)
              )}
            >
              {profile.status}
            </Badge>
          }
        />

        <Separator className="bg-zinc-600" />

        {/* Tags */}
        <DetailRow
          icon={<Tag className="h-4 w-4" />}
          label="Tags"
          value={
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {profileTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                  {tag}
                </Badge>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0 border-dashed border-gray-300 hover:border-gray-400"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          }
        />

        {/* Privacy */}
        <DetailRow
          icon={<Lock className="h-4 w-4" />}
          label="Privacy"
          value={<span className="text-gray-900">{profile.privacy}</span>}
        />

        {/* LinkedIn */}
        <DetailRow
          icon={<Linkedin className="h-4 w-4 " />}
          label="LinkedIn"
          value={
            <a
              href={
                profile.linkedin.startsWith("http")
                  ? profile.linkedin
                  : `https://${profile.linkedin}`
              }
              className="hover:underline text-sm max-w-[200px] truncate block hover:text-blue-700 bg-zinc-100 border border-zinc-300 rounded-sm px-2 py-0.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              {profile.linkedin}
            </a>
          }
        />

        {/* Email */}
        <DetailRow
          icon={<Mail className="h-4 w-4" />}
          label="Email"
          value={
            <a
              href={`mailto:${profile.email}`}
              className="text-gray-900 hover:text-blue-600 text-sm bg-zinc-100 border border-zinc-300 rounded-sm px-2 py-0.5"
            >
              {profile.email}
            </a>
          }
        />

        {/* Address */}
        <DetailRow
          icon={<Map className="h-4 w-4" />}
          label="Address"
          value={<span className="text-gray-900">{profile.address}</span>}
        />
      </div>
    </div>
  );
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  const isTag = label === "Tags";
  return (
    <div
      className={cn(
        "flex items-start gap-3 py-2",
        isTag && "flex-col items-start"
      )}
    >
      <div className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
        <span className="flex-shrink-0">{icon}</span>
        <span>{label}</span>
      </div>
      <div
        className={cn(
          "flex-1 text-sm text-right",
          isTag && "border border-dashed border-gray-300 rounded-sm p-2 "
        )}
      >
        {typeof value === "string" ? <span>{value}</span> : value}
      </div>
    </div>
  );
}
