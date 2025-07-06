'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/app/firebase/firebase';
import LoginPopup from '../auth/LoginPopup';
import { UserCircle, Search } from 'lucide-react';

export default function Sidebar({ closeSidebar }: { closeSidebar: () => void }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleClick = (path: string) => {
    router.push(path);
    closeSidebar();
  };

  return (
    <aside className="h-full p-6 min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-100 shadow-xl">
      <h1
        onClick={() => handleClick('/')}
        className="text-3xl font-extrabold text-blue-700 mb-8 cursor-pointer hover:scale-105 transition"
      >
        ⚡CoolChat
      </h1>

      {!user ? (
        <LoginPopup />
      ) : (
        <nav className="flex flex-col space-y-4 text-gray-800 text-lg font-medium">
          <button
            onClick={() => handleClick('/find-people')}
            className="flex items-center gap-2 hover:text-blue-600 transition"
          >
            <Search /> Find People
          </button>
          <button
            onClick={() => handleClick('/profile')}
            className="flex items-center gap-2 hover:text-blue-600 transition"
          >
            <UserCircle /> Profile
          </button>
        </nav>
      )}
    </aside>
  );
}
