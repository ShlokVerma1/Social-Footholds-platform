'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaChartLine, FaUserFriends } from 'react-icons/fa';

const steps = [
  {
    icon: <FaUserFriends className="text-4xl text-purple-400" />,
    title: 'Who We Help',
    desc: 'YouTube creators, independent musicians, brands, and businesses looking to scale their digital presence — at any stage of growth.',
  },
  {
    icon: <FaRocket className="text-4xl text-pink-400" />,
    title: 'What We Do',
    desc: 'End-to-end digital growth — YouTube promotion, Spotify pitching, Channel SEO, video editing, Shorts creation, and professional web services.',
  },
  {
    icon: <FaChartLine className="text-4xl text-green-400" />,
    title: 'How It Works',
    desc: 'You submit your link. We audit, strategize, and run organic promotion. No bots — only real, platform-compliant engagement. Most campaigns show measurable progress within 3–14 days.',
  },
];

export default function BusinessExplanation() {
  return (
    <section
      aria-label="About Social Foothold LLC"
      className="py-20 px-4 relative"
    >
      {/* Ambient blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Empowering Your Digital Journey
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Social Foothold LLC is a premier digital growth agency. We bridge the gap between talented creators and global audiences, ensuring your content receives the spotlight it deserves.
          </p>
        </motion.div>

        {/* Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
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

              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">
                {step.title}
              </h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                {step.desc}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Hidden SEO prose — invisible to users, fully readable by crawlers */}
        <div className="sr-only">
          <article>
            <h2>What is Social Foothold LLC?</h2>
            <p>
              Social Foothold LLC is a digital growth agency specializing in YouTube channel
              promotion, organic music promotion on Spotify and Apple Music, channel SEO
              optimization, professional video editing, YouTube Shorts creation, and web design
              and blog services. We serve content creators, independent musicians, brands, and
              small businesses across the United States and globally.
            </p>
            <p>
              Our YouTube promotion service increases video views and subscriber counts through
              organic, platform-compliant strategies — no bots, no fake views. Our channel SEO
              service helps creators rank higher in YouTube search results through keyword
              research, metadata optimization, and watch-time improvement strategies.
            </p>
            <p>
              Our music promotion service pitches independent artists to curated Spotify playlists
              and Apple Music editorial teams, helping increase monthly listeners and stream counts
              organically. For creators seeking content production support, we offer professional
              video editing and YouTube Shorts creation from long-form footage.
            </p>
            <p>
              Social Foothold LLC is trusted by creators and businesses worldwide, with campaigns designed to deliver measurable growth through ethical, platform-compliant promotion strategies.
            </p>
          </article>
        </div>

      </div>
    </section>
  );
}
