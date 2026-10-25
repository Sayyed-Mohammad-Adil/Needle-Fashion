import ResponsiveAdminDashboard from '@/components/ResponsiveAdminDashboard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResponsiveAdminDashboard>
      {children}
    </ResponsiveAdminDashboard>
  );
}