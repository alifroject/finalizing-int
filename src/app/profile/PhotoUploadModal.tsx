'use client';

import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/app/firebase/firebase';
import Image from 'next/image';
interface Props {
  uid: string;
  onClose: () => void;
  onUpload: (url: string) => void;
}

export default function PhotoUploadModal({ uid, onClose, onUpload }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    const fileRef = ref(storage, `profilePhotos/${uid}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setPreview(url);
    onUpload(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div
        ref={modalRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="animate-fadeInZoom bg-white rounded-xl shadow-xl p-6 w-96 relative transition-all duration-300"
      >
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
          Upload Profile Picture
        </h2>

        <div
          className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all rounded-lg p-6 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-gray-500">Click or drag & drop to upload image</p>
          {preview && (
            <Image
              src={preview}
              alt="Preview"
              className="mt-4 w-32 h-32 mx-auto rounded-full shadow-md"
            />
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow transition-all"
        >
          Save and Close
        </button>
      </div>
    </div>
  );
}
