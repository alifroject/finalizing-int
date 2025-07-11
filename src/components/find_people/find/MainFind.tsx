'use client';

import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { app } from '@/app/firebase/firebase';
import Image from 'next/image';
interface UserAccount {
  uid: string;
  name: string;
  gender: string;
  photoURL: string;
}

export default function FindPeople() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const [, setLoading] = useState(true);


  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return;

      const db = getFirestore(app);
      const usersCol = collection(db, 'userAccounts');
      const snapshot = await getDocs(usersCol);
      const usersData = snapshot.docs
        .map((doc) => {
          const data = doc.data() as UserAccount;
          return {
            ...data,
            uid: doc.id,
          };
        })
        .filter((user) => user.uid !== currentUser.uid);

      setUsers(usersData);

      setLoading(false);

    };

    fetchUsers();
  }, [currentUser]);

  return (
    <>


      <div className="min-h-screen px-4 py-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-sans">
        <h2 className="text-3xl font-extrabold mb-6 text-center tracking-tight text-cyan-400">
          🌟 Find People
        </h2>

        {users.length === 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-gradient-to-tr from-slate-700/70 to-slate-800/70 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-slate-600"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-slate-600" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-600 rounded"></div>
                    <div className="h-3 w-1/2 bg-slate-600 rounded"></div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="h-8 w-24 bg-slate-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user.uid}
                className="bg-gradient-to-tr from-slate-700/70 to-slate-800/70 backdrop-blur-md rounded-2xl p-5 shadow-xl hover:shadow-cyan-500/30 transition-shadow duration-300 border border-slate-600"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={user.photoURL}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{user.name}</h3>
                    <p className="text-sm text-cyan-300">{user.gender}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={() => router.push(`/find-people/chat/${user.uid}`)}
                  >
                    💬 Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
