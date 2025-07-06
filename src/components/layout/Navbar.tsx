'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/app/firebase/firebase';
import LoginPopup from '../auth/LoginPopup';
import { FiUsers, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-md py-4 px-6 flex justify-between items-center font-sans border-b border-white/20">
      {/* Logo */}
      <button
        onClick={() => router.push('/')}
        className="text-2xl text-white font-extrabold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent animate-pulse drop-shadow-md"
      >
        
        <span className="ml-1 tracking-wider">⚡CoolChat</span>
      </button>

      {/* Right Menu */}
      <div className="flex items-center space-x-6 text-white font-medium">
        {!authChecked ? null : !user ? (
          <LoginPopup />
        ) : (
          <>
            <Link
              href="/find-people"
              className="flex items-center gap-1 hover:text-yellow-300 transition duration-200 hover:scale-105"
            >
              <FiUsers className="text-lg" />
              <span>Find People</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-1 hover:text-green-300 transition duration-200 hover:scale-105"
            >
              <FiUser className="text-lg" />
              <span>Profile</span>
            </Link>
          </>
        )}
      </div>

      {/* Custom animation for spinning icon */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </nav>
  );
}
