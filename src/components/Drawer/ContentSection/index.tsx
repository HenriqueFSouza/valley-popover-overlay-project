"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, MessageCircle } from "lucide-react";
import AITraining from "./AITraining";
import Messages from "./Messages";

interface ContentSectionProps {
  profileId: string;
}

export default function ContentSection({ profileId }: ContentSectionProps) {
  return (
    <div className="bg-white/80 rounded-lg p-6 space-y-4">
      <Tabs defaultValue="ai-training" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai-training" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Training
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-training" className="mt-6">
          <AITraining profileId={profileId} />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <Messages profileId={profileId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
