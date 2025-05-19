// src/components/LayoutClient.tsx
"use client";
import { useUserStore } from '@/store/userStore';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useUserStore();

  return (
    <div className="flex flex-col min-h-screen">
      <Header loading={loading} user={user} onLogout={logout} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}