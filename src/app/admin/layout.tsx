import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-coastal-light-grey">
      <AdminNav />
      <main className="p-8">{children}</main>
    </div>
  );
}
