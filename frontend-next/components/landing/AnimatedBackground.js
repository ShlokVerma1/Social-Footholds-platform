'use client'

import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none animated-mesh-bg overflow-hidden">
      {/* Floating Ring Geometry */}
      <motion.svg 
        viewBox="0 0 400 400" 
        className="absolute top-[5%] left-[-10%] md:left-[5%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] opacity-[0.15] drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" className="text-pink-500" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="4" className="text-purple-400 opacity-50" />
      </motion.svg>

      {/* Isometric Wireframe Polygon */}
      <motion.svg
        viewBox="0 0 300 300"
        className="absolute bottom-[10%] md:bottom-[5%] right-[-10%] md:right-[5%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] opacity-20 drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]"
        animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      >
        <polygon points="150,20 280,95 280,245 150,320 20,245 20,95" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-500" />
        <polygon points="150,50 250,110 250,230 150,290 50,230 50,110" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" className="text-purple-500" />
        <line x1="150" y1="20" x2="150" y2="170" stroke="currentColor" strokeWidth="2" className="text-pink-500/50" />
        <line x1="280" y1="95" x2="150" y2="170" stroke="currentColor" strokeWidth="2" className="text-pink-500/50" />
        <line x1="20" y1="95" x2="150" y2="170" stroke="currentColor" strokeWidth="2" className="text-pink-500/50" />
        <circle cx="150" cy="170" r="4" fill="currentColor" className="text-white opacity-60" />
      </motion.svg>

      {/* Abstract Tech Triangles */}
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute top-[40%] md:top-[30%] right-[10%] md:right-[20%] w-[300px] h-[300px] md:w-[450px] md:h-[450px] opacity-10"
        animate={{ scale: [1, 1.1, 1], rotate: [0, -15, 0], x: [0, 30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      >
        <polygon points="200,50 350,300 50,300" fill="none" stroke="currentColor" strokeWidth="1" className="text-indigo-400" />
        <polygon points="200,100 300,270 100,270" fill="none" stroke="currentColor" strokeWidth="4" className="text-purple-500/40" />
        <circle cx="200" cy="50" r="3" fill="currentColor" className="text-indigo-300" />
        <circle cx="350" cy="300" r="3" fill="currentColor" className="text-indigo-300" />
        <circle cx="50" cy="300" r="3" fill="currentColor" className="text-indigo-300" />
      </motion.svg>
    </div>
  );
}
