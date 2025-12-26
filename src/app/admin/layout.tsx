import { redirect } from "next/navigation";
import { AdminSidebar } from "~/components/admin/AdminSidebar";
import { getCurrentUser } from "~/actions/get-projects";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Double-check admin role (middleware should handle this, but defense in depth)
  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminSidebar
        user={{
          email: user.email,
          company_name: user.company_name,
        }}
      />
      <main className="pl-64 transition-all duration-300 [.sidebar-collapsed_&]:pl-[72px]">
        {children}
      </main>
    </div>
  );
}

