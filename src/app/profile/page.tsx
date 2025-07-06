'use client';

import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, dbFire } from '@/app/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import PhotoUploadModal from './PhotoUploadModal';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(dbFire, 'userAccounts', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setDisplayName(data.displayName || user.displayName || '');
          setPhotoURL(data.photoURL || user.photoURL || '');
          setBio(data.bio || '');
          setGender(data.gender || '');
          setLocation(data.location || '');
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (user) {
      try {
        const userRef = doc(dbFire, 'userAccounts', user.uid);
        await setDoc(
          userRef,
          {
            uid: user.uid,
            email: user.email,
            displayName,
            photoURL,
            bio,
            gender,
            location,
            name: displayName,
          },
          { merge: true }
        );
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Failed to update profile.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-700 text-lg">You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] p-6 text-white font-sans">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <PhotoUploadModal
            uid={user.uid}
            onClose={() => setShowModal(false)}
            onUpload={(url) => {
              setPhotoURL(url);
              setShowModal(false);
            }}
          />
        </div>
      )}


      <h1 className="text-4xl font-bold mb-10 text-center text-white tracking-wide">Your Profile</h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">


        {/* Avatar and Email Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">

          <div
            onClick={() => setShowModal(true)}
            className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg group cursor-pointer"
          >
            <div
              onClick={() => setShowModal(true)}
              className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg group cursor-pointer"
            >
              <img
                src={photoURL || '/default-avatar.png'}
                alt="Profile"
                onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
                className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
              />

              {/* Just the icon, no dark overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.213 3 21l.787-4.5L16.862 4.487z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              onClick={() => setShowModal(true)}
              className="relative w-24 h-24 rounded-full overflow-hidden   shadow-lg group cursor-pointer"
            >
              <img
                src={photoURL || '/default-avatar.png'}
                alt="Profile"
                className="w-full h-full object-cover"
              />

              {/* Just the icon, no dark overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/60 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.213 3 21l.787-4.5L16.862 4.487z"
                    />
                  </svg>
                </div>
              </div>
            </div>

          </div>
          <div>
            <p className="text-xl font-semibold">{displayName || "Your Name"}</p>
            <p className="text-gray-300 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 font-medium text-gray-200">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="p-3 rounded bg-white bg-opacity-10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            placeholder="Your full name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <label htmlFor="gender" className="mb-2 font-medium text-gray-200">
            Gender
          </label>
          <input
            id="gender"
            type="text"
            className="p-3 rounded bg-white bg-opacity-10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            placeholder="Male / Female / Other"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label htmlFor="location" className="mb-2 font-medium text-gray-200">
            Location
          </label>
          <input
            id="location"
            type="text"
            className="p-3 rounded bg-white bg-opacity-10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            placeholder="e.g. Jakarta, Indonesia"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="bio" className="mb-2 font-medium text-gray-200">
            Short Bio
          </label>
          <textarea
            id="bio"
            className="p-3 rounded bg-white bg-opacity-10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            placeholder="Tell us a little about yourself..."
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <button
            onClick={handleSave}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded transition shadow-md"
          >
            Save Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded transition shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

  );

}
