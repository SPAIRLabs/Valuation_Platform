'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/appStore';
import Dashboard from './dashboard/page';
import LoginPage from './login/page';

export default function Home() {
  const { user } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <LoginPage />;
  }

  return <Dashboard />;
}
