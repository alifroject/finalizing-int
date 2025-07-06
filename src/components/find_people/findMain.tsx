'use client';
import { useState } from 'react';
import FindMain from "../find_people/find/MainFind";
import MyChat from "../find_people/myChat/MyChat";

export default function MainFind() {
  const [activeTab, setActiveTab] = useState<'people' | 'chart'>('people');

  return (
    <div className="p-4">
      {/* Sub-Navbar Centered */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex space-x-6 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 p-1 shadow-lg">
          <button
            onClick={() => setActiveTab('people')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${activeTab === 'people'
                ? 'bg-gradient-to-r from-yellow-500 via-sky-500 to-cyan-500 text-white shadow-md animate-glow animate-tab-move'
                : 'text-white hover:bg-white/10'
              }`}
          >
            Find People
          </button>

          <button
            onClick={() => setActiveTab('chart')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${activeTab === 'chart'
                ? 'bg-gradient-to-r from-yellow-500 via-sky-500 to-cyan-500 text-white shadow-md animate-glow animate-tab-move'
                : 'text-white hover:bg-white/10'
              }`}
          >
            My Chat
          </button>

        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'people' && <FindMain />}
        {activeTab === 'chart' && <MyChat />}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
  @keyframes glow {
    0% {
      box-shadow: 0 0 5px #38bdf8, 0 0 10px #38bdf8, 0 0 15px #38bdf8;
    }
    50% {
      box-shadow: 0 0 15px #0ea5e9, 0 0 25px #0ea5e9, 0 0 35px #0ea5e9;
    }
    100% {
      box-shadow: 0 0 5px #38bdf8, 0 0 10px #38bdf8, 0 0 15px #38bdf8;
    }
  }

  .animate-glow {
    animation: glow 3s ease-in-out infinite;
  }

  @keyframes tabSwitch {
    0% {
      transform: scale(0.95) translateY(4px);
      opacity: 0.6;
    }
    100% {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }

  .animate-tab-move {
    animation: tabSwitch 0.3s ease-out;
  }
`}</style>

    </div>
  );
}
