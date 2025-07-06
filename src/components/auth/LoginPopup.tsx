'use client';
import { useEffect, useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider, dbFire, storage } from '@/app/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function LoginPopup() {
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false); // 👈 new

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userRef = doc(dbFire, 'userAccounts', user.uid);
        const userSnap = await getDoc(userRef);

        let photoURL = '';

        if (user.photoURL) {
          const response = await fetch(user.photoURL);
          const blob = await response.blob();
          const imageRef = ref(storage, `userPhotos/${user.uid}.jpg`);
          await uploadBytes(imageRef, blob);
          photoURL = await getDownloadURL(imageRef);
        }

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            photoURL,
            createdAt: new Date().toISOString(),
          });
          console.log('User account created in Firestore');
        } else {
          console.log('User already exists in Firestore');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 
    ${loading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-xl'}
  `}
    >
      {isClient ? (loading ? 'Logging in...' : 'Login with Google') : '...'}
    </button>

  );
}
