import { Sidebar } from "~/components/dashboard/Sidebar";
import { mockUser } from "~/lib/mock-data";

export default function DemoClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        user={{
          email: mockUser.email,
          company_name: mockUser.company_name,
          role: mockUser.role,
        }}
      />
      <main className="pl-64 transition-all duration-300">
        {/* Demo mode banner */}
        <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-primary/10 px-4 py-2 text-sm text-primary">
          <span className="inline-flex size-2 animate-pulse rounded-full bg-primary" />
          Demo Mode – Connect Supabase to enable full functionality
        </div>
        {children}
      </main>
    </div>
  );
}

