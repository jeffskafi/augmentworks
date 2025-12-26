import { redirect } from "next/navigation";
import { Sidebar } from "~/components/dashboard/Sidebar";
import { getCurrentUser } from "~/actions/get-projects";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        user={{
          email: user.email,
          company_name: user.company_name,
          role: user.role,
        }}
      />
      <main className="pl-64 transition-all duration-300 [.sidebar-collapsed_&]:pl-[72px]">
        {children}
      </main>
    </div>
  );
}

