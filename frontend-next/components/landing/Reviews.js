'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

export default function Reviews() {
  const reviews = [
    {
      name: "Alex R.",
      role: "Tech YouTuber",
      content: "Social Foothold transformed my channel. I went from struggling to get 1,000 views to regularly hitting 50k+ per video. Their organic promotion strategies are unmatched.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=11"
    },
    {
      name: "Sarah M.",
      role: "Indie Musician",
      content: "I used their Spotify promotion service and saw a massive spike in genuine listeners and playlist placements. Highly recommend their services to any upcoming artist!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=5"
    },
    {
      name: "David K.",
      role: "Business Owner",
      content: "Our brand's digital presence was practically non-existent. The SEO and web services provided by this team helped us rank higher and acquire new clients consistently.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=3"
    },
    {
      name: "Jessica T.",
      role: "Lifestyle Vlogger",
      content: "The video editing and shorts creation services are top-notch. They repurposed my long videos into viral shorts that gained me thousands of new subscribers in weeks.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=9"
    },
    {
      name: "Marcus J.",
      role: "Podcast Host",
      content: "Their team is incredibly professional. The channel SEO optimization they did for my podcast highlights put my episodes on the first page of search results.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=12"
    },
    {
      name: "Elena P.",
      role: "E-commerce Founder",
      content: "Amazing web and blog services! The landing pages they designed converted way better than anything we had before, and the blog content is driving consistent organic traffic.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=1"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">What Our Clients Say</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied creators and businesses who have scaled their presence with our proven strategies.
          </p>
        </motion.div>

        <div className="relative overflow-hidden w-full py-4 max-w-7xl mx-auto">
          {/* Edge Gradients for smooth fade out */}
          <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#0f0f1a] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#0f0f1a] to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex space-x-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
          >
            {[...reviews, ...reviews].map((review, index) => (
              <div
                key={index}
                className="w-[320px] md:w-[380px] shrink-0 bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-pink-500/40 transition-all duration-300 relative group flex flex-col min-h-[280px]"
              >
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-lg" />
                  ))}
                </div>
                <p className="text-gray-300 mb-8 leading-relaxed italic flex-grow">"{review.content}"</p>
                
                <div className="flex items-center mt-auto">
                  <img 
                    src={review.image} 
                    alt={review.name} 
                    className="w-14 h-14 rounded-full border-2 border-purple-500/50 mr-4"
                  />
                  <div>
                    <h4 className="text-white font-bold">{review.name}</h4>
                    <p className="text-purple-400 text-sm">{review.role}</p>
                  </div>
                </div>

                {/* Decorative hover gradient */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
