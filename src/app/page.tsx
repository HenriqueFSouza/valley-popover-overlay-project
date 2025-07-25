import PopoverOverlay from "@/components/Drawer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">Valley Challenge</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your Next.js project is now configured with TailwindCSS v4 and
              ShadcnUI components
            </p>
          </div>
        </div>
      </div>
      <PopoverOverlay />
    </main>
  );
}
