'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
    serverTimestamp,
    arrayUnion,
} from 'firebase/firestore';

import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/app/firebase/firebase';

interface UserAccount {
    uid: string;
    name: string;
    gender: string;
    photoURL: string;
}

interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    createdAt: any;
}

export default function ChatPage() {
    const { id } = useParams();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [targetUser, setTargetUser] = useState<UserAccount | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [moderationWarning, setModerationWarning] = useState('');


    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchTargetUser = async () => {
            if (!id) return;

            const db = getFirestore(app);
            const userDocRef = doc(db, 'userAccounts', id as string);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                setTargetUser(userSnap.data() as UserAccount);
            }
        };

        fetchTargetUser();
    }, [id]);

    useEffect(() => {
        if (!currentUser || !id) return;

        const db = getFirestore(app);
        const chatPairId = [currentUser.uid, id].sort().join('_');
        const chatRef = doc(db, 'chattings', chatPairId);

        const unsubscribe = onSnapshot(chatRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const msgList = data.messages || [];

                const filtered = msgList.map((msg: any, index: number) => ({
                    id: index.toString(),
                    ...msg,
                }));

                setMessages(filtered);
                setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            }
        });

        return () => unsubscribe();
    }, [currentUser, id]);

    const handleSend = async () => {
        if (!newMessage.trim() || !currentUser || !id) return;

        try {
            // Step 1: Call /api/moderate to check the message
            const res = await fetch('/api/moderate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage }),
            });

            const { decision } = await res.json();

            if (decision === 'block') {
                setModerationWarning('Message blocked due to hate speech, bias, or privacy violation.');
                return;
            }

            setModerationWarning(''); // Clear any previous warning if message is allowed

            // Step 2: Send the message to Firestore
            const db = getFirestore(app);
            const chatPairId = [currentUser.uid, id].sort().join('_');
            const chatRef = doc(db, 'chattings', chatPairId);

            const newChat = {
                senderId: currentUser.uid,
                text: newMessage,
                createdAt: new Date(),
            };

            const chatSnap = await getDoc(chatRef);

            if (chatSnap.exists()) {
                await updateDoc(chatRef, {
                    messages: arrayUnion(newChat),
                    updatedAt: serverTimestamp(),
                });
            } else {
                await setDoc(chatRef, {
                    messages: [newChat],
                    createdAt: serverTimestamp(),
                });
            }

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };



    return (
        <div className="flex flex-col h-screen bg-[#121212] text-white">
            {/* Top Profile Bar */}
            {targetUser ? (
                <div className="flex items-center gap-4 p-4 bg-gray-900 border-b border-gray-700 shadow-md">
                    <img
                        src={targetUser.photoURL}
                        alt={targetUser.name}
                        className="w-12 h-12 rounded-full border-2 border-blue-500"
                    />
                    <div className="flex flex-col bg-gray-800 px-4 py-2 rounded-lg">
                        <span className="font-semibold text-lg">{targetUser.name}</span>
                        <span className="text-gray-400 text-sm">{targetUser.gender}</span>
                    </div>
                </div>
            ) : (
                <div className="p-4 text-center text-gray-300">Loading user...</div>
            )}

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 bg-[#181818]">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-xs px-4 py-2 rounded-xl text-sm shadow-md break-words ${msg.senderId === currentUser?.uid
                                ? 'bg-blue-600 ml-auto text-white'
                                : 'bg-gray-700 text-white'
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-900">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg text-white font-medium transition"
                    >
                        Send
                    </button>
                </div>
                {moderationWarning && (
                    <p className="text-red-400 mt-2 text-sm">{moderationWarning}</p>
                )}
            </div>
        </div>
    );

}
