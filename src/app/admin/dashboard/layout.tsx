import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminSidebar } from '@/components/AdminSidebar';
import { FooterAdmin } from '@/components/FooterAdmin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 px-6 py-8">
          {children}
        </main>
      </div>
      <FooterAdmin />
    </div>
  );
}
