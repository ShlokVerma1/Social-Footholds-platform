'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { servicesData } from '@/constants/data';

export default function ServicesDeck() {
  const [activeService, setActiveService] = useState(0);

  const handleNextService = () => {
    setActiveService((prev) => (prev + 1) % servicesData.length);
  };

  const handlePrevService = () => {
    setActiveService((prev) => (prev - 1 + servicesData.length) % servicesData.length);
  };

  return (
    <section id="services" className="py-20 px-4 bg-black/30">
      <div className="max-w-7xl mx-auto">
        {/* Title Motion Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Premium Services</h2>
            <p className="text-xl text-gray-400">Everything you need to succeed as a content creator</p>
          </div>

          {/* 3D Carousel Physics Engine */}
          <div className="relative w-full max-w-6xl mx-auto mt-24 h-[600px] flex justify-center items-center perspective-[1500px]">
            {servicesData.map((service, index) => {
              const offset = index - activeService;
              
              // Normalize the carousel loop mathematically
              let normalizedOffset = offset;
              if (offset < -2) normalizedOffset += servicesData.length;
              if (offset > 2) normalizedOffset -= servicesData.length;
              
              const absOffset = Math.abs(normalizedOffset);
              const isActive = normalizedOffset === 0;
              
              // Render only visible neighbors natively
              if (absOffset > 2) return null;

              const translateX = normalizedOffset * 150;
              const rotateY = normalizedOffset * -25;
              const translateZ = absOffset * -100;
              const opacity = isActive ? 1 : Math.max(0, 1 - (absOffset * 0.4));
              const zIndex = 10 - absOffset;
              
              const cardScale = isActive ? 1 : 0.85;

              return (
                <motion.div
                  key={index}
                  onClick={() => setActiveService(index)}
                  animate={{
                    x: translateX,
                    z: translateZ,
                    rotateY: rotateY,
                    scale: cardScale,
                    opacity: opacity,
                  }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.15 }}
                  style={{ zIndex, transformStyle: "preserve-3d", originX: normalizedOffset < 0 ? 1 : 0 }}
                  className={`absolute w-[95%] md:w-[450px] bg-black/50 backdrop-blur-xl p-8 md:p-10 rounded-3xl border ${isActive ? 'border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.3)]' : 'border-white/10 shadow-lg hover:border-purple-500/30'} cursor-pointer transform-gpu overflow-hidden`}
                >
                  {/* Glowing Top Accent Edge */}
                  {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />}

                  <div className="mb-6 transform transition-transform duration-300 hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    {service.icon}
                  </div>
                  <h3 className={`text-2xl md:text-3xl font-bold mb-3 ${isActive ? 'text-white' : 'text-gray-300'}`}>{service.name}</h3>
                  <p className={`mb-6 leading-relaxed ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>{service.description}</p>
                  
                  <ul className={`space-y-4 mb-8 transition-opacity duration-300 ${isActive ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-gray-200 flex items-start font-medium text-sm md:text-base">
                        <FaCheckCircle className="text-green-400 mr-3 mt-1 min-w-[16px] drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isActive && (
                    <Link href="/register" className="inline-flex items-center font-bold transition-all duration-300 text-purple-400 hover:text-pink-300 hover:translate-x-2">
                      Learn More <FaArrowRight className="ml-2" />
                    </Link>
                  )}
                </motion.div>
              );
            })}

            {/* Navigation Chevrons inside the carousel bounds */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:left-4 z-20">
              <button onClick={handlePrevService} className="bg-black/60 hover:bg-black/80 border border-white/20 text-white p-3 md:p-4 rounded-full backdrop-blur-md transition-all hover:scale-110 hover:border-purple-500/50 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <FaChevronLeft className="text-xl" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:right-4 z-20">
              <button onClick={handleNextService} className="bg-black/60 hover:bg-black/80 border border-white/20 text-white p-3 md:p-4 rounded-full backdrop-blur-md transition-all hover:scale-110 hover:border-purple-500/50 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <FaChevronRight className="text-xl" />
              </button>
            </div>

            {/* Bottom Pagination Dots */}
            <div className="absolute -bottom-8 md:-bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
              {servicesData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveService(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${activeService === idx ? 'w-10 bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'w-2.5 bg-white/20 hover:bg-white/40'}`}
                  aria-label={`Go to service ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
