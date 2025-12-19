'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

const Loader = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Prevent SSR mismatch — only render on client
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <motion.div
      className="flex justify-center items-center h-screen bg-gradient-to-br 
                 from-white/10 via-blue-50/10 to-transparent 
                 dark:from-slate-900 dark:via-slate-800 dark:to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="modern-loader"></div>
    </motion.div>
  );
};

export default Loader;
