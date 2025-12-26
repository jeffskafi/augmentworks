import { AdminSidebar } from "~/components/admin/AdminSidebar";

export default function DemoAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      <AdminSidebar
        user={{
          email: "admin@agentready.com",
          company_name: "AgentReady",
        }}
      />
      <main className="pl-64 transition-all duration-300 [.sidebar-collapsed_&]:pl-[72px]">
        {children}
      </main>
    </div>
  );
}

