'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaChartLine, FaUserFriends } from 'react-icons/fa';

export default function BusinessExplanation() {
  const steps = [
    {
      icon: <FaUserFriends className="text-4xl text-purple-400" />,
      title: "Who We Help",
      desc: "Content Creators, Musicians, Brands, and Businesses looking to scale their digital presence. Whether you are starting out or aiming for the next millions, we tailor our approach to you."
    },
    {
      icon: <FaRocket className="text-4xl text-pink-400" />,
      title: "What We Do",
      desc: "We provide end-to-end growth solutions. From Channel SEO to targeted Video and Music Promotion, we ensure your content reaches the right audience at the right time."
    },
    {
      icon: <FaChartLine className="text-4xl text-green-400" />,
      title: "How It Works",
      desc: "Our strategies rely on organic, data-driven promotion and professional content optimization. We do not use bots—only authentic engagement to build a sustainable and loyal fanbase."
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Empowering Your Digital Journey</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Social Foothold LLC is a premier digital growth agency. We bridge the gap between talented creators and global audiences, ensuring your content receives the spotlight it deserves.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.02 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.15, ease: 'easeOut' }}
              className="bg-black/30 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] flex flex-col items-center text-center relative group overflow-hidden"
            >
              {/* Animated hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 pointer-events-none" />
              
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="mb-6 bg-gradient-to-br from-white/5 to-white/10 p-5 rounded-2xl border border-white/10 shadow-lg group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300"
              >
                {step.icon}
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
