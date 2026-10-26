import ResponsiveAdminDashboard from '@/components/ResponsiveAdminDashboard';
import AdminGuard from '@/components/AdminGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <ResponsiveAdminDashboard>
        {children}
      </ResponsiveAdminDashboard>
    </AdminGuard>
  );
}