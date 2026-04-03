'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { servicesData } from '@/constants/data';

/* ─────────────────────────────────────────────
   MOBILE — existing carousel, completely untouched
───────────────────────────────────────────── */
function MobileCarousel({ activeService, setActiveService }) {
  const handleNext = () => setActiveService(p => (p + 1) % servicesData.length);
  const handlePrev = () => setActiveService(p => (p - 1 + servicesData.length) % servicesData.length);

  return (
    <div
      className="relative w-full max-w-6xl mx-auto mt-24 h-[600px] flex justify-center items-center"
      style={{ perspective: '1500px' }}
    >
      {servicesData.map((service, index) => {
        const offset = index - activeService;

        let normalizedOffset = offset;
        if (offset < -2) normalizedOffset += servicesData.length;
        if (offset > 2)  normalizedOffset -= servicesData.length;

        const absOffset = Math.abs(normalizedOffset);
        const isActive  = normalizedOffset === 0;

        if (absOffset > 2) return null;

        const translateX = normalizedOffset * 150;
        const rotateY    = normalizedOffset * -25;
        const translateZ = absOffset * -100;
        const opacity    = isActive ? 1 : Math.max(0, 1 - absOffset * 0.4);
        const zIndex     = 10 - absOffset;
        const cardScale  = isActive ? 1 : 0.85;

        return (
          <motion.div
            key={index}
            onClick={() => setActiveService(index)}
            animate={{ x: translateX, z: translateZ, rotateY, scale: cardScale, opacity }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.15 }}
            style={{ zIndex, transformStyle: 'preserve-3d', originX: normalizedOffset < 0 ? 1 : 0 }}
            className={`absolute w-[95%] bg-black/50 backdrop-blur-xl p-8 rounded-3xl border
              ${isActive
                ? 'border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.3)]'
                : 'border-white/10 shadow-lg hover:border-purple-500/30'}
              cursor-pointer transform-gpu overflow-hidden`}
          >
            {isActive && (
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            )}

            <div className="mb-6 transform transition-transform duration-300 hover:scale-110
                            drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {service.icon}
            </div>

            <h3 className={`text-2xl font-bold mb-3 ${isActive ? 'text-white' : 'text-gray-300'}`}>
              {service.name}
            </h3>
            <p className={`mb-6 leading-relaxed ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
              {service.description}
            </p>

            <ul className={`space-y-4 mb-8 transition-opacity duration-300 ${isActive ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
              {service.features.map((feature, idx) => (
                <li key={idx} className="text-gray-200 flex items-start font-medium text-sm">
                  <FaCheckCircle className="text-green-400 mr-3 mt-1 min-w-[16px]
                                            drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {isActive && (
              <Link href="/register"
                className="inline-flex items-center font-bold transition-all duration-300
                           text-purple-400 hover:text-pink-300 hover:translate-x-2">
                Learn More <FaArrowRight className="ml-2" />
              </Link>
            )}
          </motion.div>
        );
      })}

      {/* Prev / Next */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-20">
        <button onClick={handlePrev}
          className="bg-black/60 hover:bg-black/80 border border-white/20 text-white p-3 rounded-full
                     backdrop-blur-md transition-all hover:scale-110 hover:border-purple-500/50
                     shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <FaChevronLeft className="text-xl" />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-20">
        <button onClick={handleNext}
          className="bg-black/60 hover:bg-black/80 border border-white/20 text-white p-3 rounded-full
                     backdrop-blur-md transition-all hover:scale-110 hover:border-purple-500/50
                     shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <FaChevronRight className="text-xl" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {servicesData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveService(idx)}
            className={`h-2.5 rounded-full transition-all duration-300
              ${activeService === idx
                ? 'w-10 bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.8)]'
                : 'w-2.5 bg-white/20 hover:bg-white/40'}`}
            aria-label={`Go to service ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DESKTOP — fan / spread deck
   All cards visible, fanned left & right.
   Clicking any card brings it to front.
───────────────────────────────────────────── */

// Per-offset visual transform config
const FAN_CONFIG = [
  // absOffset 0 — active card
  { x: 0,    y: 0,  rotateZ: 0,   scale: 1,    opacity: 1,    zIndex: 30 },
  // absOffset 1
  { x: 230,  y: 28, rotateZ: 9,   scale: 0.88, opacity: 0.82, zIndex: 20 },
  // absOffset 2
  { x: 415,  y: 68, rotateZ: 17,  scale: 0.76, opacity: 0.60, zIndex: 12 },
  // absOffset 3 (can appear with 6 cards)
  { x: 560,  y: 110,rotateZ: 24,  scale: 0.65, opacity: 0.35, zIndex: 6  },
];

function getFanTransform(normalizedOffset) {
  const absOff = Math.abs(normalizedOffset);
  const sign   = normalizedOffset < 0 ? -1 : 1;
  const cfg    = FAN_CONFIG[Math.min(absOff, 3)];
  return {
    x:       sign * cfg.x,
    y:       cfg.y,
    rotateZ: sign * cfg.rotateZ,
    scale:   cfg.scale,
    opacity: cfg.opacity,
    zIndex:  cfg.zIndex,
  };
}

function DesktopFan({ activeService, setActiveService }) {
  const count = servicesData.length;

  return (
    <div className="relative w-full mt-10" style={{ height: '560px' }}>

      {/* Card stack — centred in container */}
      <div className="relative w-full h-full flex justify-center items-start pt-10">
        {servicesData.map((service, index) => {
          const raw    = index - activeService;

          // Normalise to nearest path around the loop
          let norm = raw;
          if (norm < -(count / 2)) norm += count;
          if (norm >  (count / 2)) norm -= count;

          const isActive = norm === 0;
          const { x, y, rotateZ, scale, opacity, zIndex } = getFanTransform(norm);

          return (
            <motion.div
              key={index}
              animate={{ x, y, rotateZ, scale, opacity }}
              transition={{ type: 'tween', duration: 0.03, ease: 'easeOut' }}
              style={{
                position:        'absolute',
                zIndex,
                transformOrigin: 'bottom center',
                cursor:          isActive ? 'default' : 'pointer',
              }}
              onClick={() => !isActive && setActiveService(index)}
              className={`w-[300px] bg-[#0d0718] backdrop-blur-2xl rounded-2xl border overflow-hidden
                select-none
                ${isActive
                  ? 'border-purple-500 shadow-[0_0_60px_rgba(168,85,247,0.45)]'
                  : 'border-white/10 hover:border-purple-400/50 shadow-2xl'}`}
            >
              {/* Purple top bar on active */}
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-[3px]
                                bg-gradient-to-r from-purple-500 to-pink-500" />
              )}

              <div className="p-7">
                {/* Icon */}
                <div className={`mb-4 transition-transform duration-300
                                 drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]
                                 ${isActive ? 'scale-110' : ''}`}>
                  {service.icon}
                </div>

                {/* Name */}
                <h3 className={`text-lg font-bold mb-1.5 leading-snug
                  ${isActive ? 'text-white' : 'text-gray-300'}`}>
                  {service.name}
                </h3>

                {/* Description — always visible */}
                <p className={`text-sm leading-relaxed
                  ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                  {service.description}
                </p>

                {/* Features + CTA — slide open only on active */}
                <motion.div
                  initial={false}
                  animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <ul className="space-y-3 mt-5 mb-5">
                    {service.features.map((f, i) => (
                      <li key={i} className="text-gray-200 flex items-start text-sm font-medium">
                        <FaCheckCircle className="text-green-400 mr-2.5 mt-0.5 min-w-[13px]
                                                   drop-shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/register"
                    className="inline-flex items-center text-sm font-bold transition-all duration-300
                               text-purple-400 hover:text-pink-300 hover:translate-x-1.5">
                    Learn More <FaArrowRight className="ml-2" />
                  </Link>
                </motion.div>

                {/* Subtle click hint on inactive cards */}
                {!isActive && (
                  <p className="mt-3 text-[11px] text-white/20 tracking-wide">
                    click to expand
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-3 z-40">
        {servicesData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveService(idx)}
            className={`h-2.5 rounded-full transition-all duration-300
              ${activeService === idx
                ? 'w-10 bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.8)]'
                : 'w-2.5 bg-white/20 hover:bg-white/40'}`}
            aria-label={`Go to service ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT — picks layout based on screen width
───────────────────────────────────────────── */
export default function ServicesDeck() {
  const [activeService, setActiveService] = useState(0);
  const [isDesktop, setIsDesktop]         = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section id="services" className="py-20 px-4 bg-black/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Premium Services</h2>
            <p className="text-xl text-gray-400">Everything you need to succeed as a content creator</p>
          </div>

          {isDesktop
            ? <DesktopFan    activeService={activeService} setActiveService={setActiveService} />
            : <MobileCarousel activeService={activeService} setActiveService={setActiveService} />
          }
        </motion.div>
      </div>
    </section>
  );
}
