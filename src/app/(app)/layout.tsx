import { BottomNav } from "@/components/layout/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-24 pt-[max(1.5rem,env(safe-area-inset-top))]">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
