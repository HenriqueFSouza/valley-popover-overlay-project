"use client";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import ContentSection from "./ContentSection";
import HeaderSection from "./HeaderSection";
import ProfileSection from "./ProfileSection";

interface PopoverOverlayProps {
  profileId?: string;
  isOpen?: boolean;
  onClose?: () => void;
  currentIndex?: number;
  totalCount?: number;
  context?: string;
}

export default function PopoverOverlay({
  profileId = "profile_1", // Default profile ID for now
  isOpen = true,
  onClose = () => {},
  currentIndex = 1,
  totalCount = 540,
  context = "Valley Sales Strategy",
}: PopoverOverlayProps) {
  return (
    <Drawer open={isOpen} direction="right">
      <DrawerContent className="min-w-3/4 bg-gray-100 p-4">
        <DrawerHeader>
          <HeaderSection
            onClose={onClose}
            currentIndex={currentIndex}
            totalCount={totalCount}
            context={context}
          />
        </DrawerHeader>

        <div className="relative p-8 rounded-lg bg-white/80">
          <div className="w-full flex gap-6">
            <div className="w-3/4">
              <ContentSection profileId={profileId} />
            </div>

            {/* Scrollable Content */}
            <div className="w-1/4">
              {/* Profile Section */}
              <ProfileSection profileId={profileId} />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
