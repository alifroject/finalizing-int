'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectChat() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/find-people'); // push() if you want it in history
  }, [router]);

  return null;
}
