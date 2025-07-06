'use client';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { SiReact } from 'react-icons/si';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(false);

  // Auto-close sidebar on resize ≥ md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Navbar for md+ */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Sidebar closeSidebar={() => setShowSidebar(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button (Mobile only) */}
      <motion.button
        onClick={() => setShowSidebar((prev) => !prev)}
        className={`md:hidden fixed top-11 right-4  z-50 p-3 rounded-full shadow-lg transition-colors duration-300
          ${showSidebar ? 'bg-red-600 text-white' : 'bg-blue-500 text-white'}
        `}
        whileTap={{ scale: 0.9 }}
      >
        {showSidebar ? (
          <X className="w-4 h-4" />
        ) : (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          >
            <SiReact className="w-4 h-4" />
          </motion.div>
        )}
      </motion.button>

      <main>{children}</main>
    </>
  );
}
