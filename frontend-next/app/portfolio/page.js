import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/Footer';
import Reviews from '@/components/landing/Reviews';
import AnimatedBackground from '@/components/landing/AnimatedBackground';
import { FaYoutube, FaMusic, FaArrowUp, FaUsers } from 'react-icons/fa';

export const metadata = {
  title: 'Portfolio & Success Stories | Social Foothold LLC',
  description: 'See how we have helped content creators, musicians, and businesses scale their digital presence with our proven organic growth strategies.',
};

export default function PortfolioPage() {
  const caseStudies = [
    {
      title: "Gaming Channel Explosion",
      category: "YouTube Promotion",
      icon: <FaYoutube className="text-3xl text-red-500" />,
      stats: [
        { label: "Views Gained", value: "2.5M+", icon: <FaArrowUp className="text-green-400" /> },
        { label: "Subscribers", value: "+45k", icon: <FaUsers className="text-purple-400" /> }
      ],
      description: "A mid-sized gaming creator was stuck at 10k subscribers. Through targeted promotion and Channel SEO optimization, we expanded their reach to a global audience, resulting in viral traction on their let's play series."
    },
    {
      title: "Indie Pop Artist Breakthrough",
      category: "Music Promotion",
      icon: <FaMusic className="text-3xl text-green-500" />,
      stats: [
        { label: "Spotify Streams", value: "500k+", icon: <FaArrowUp className="text-green-400" /> },
        { label: "Playlist Adds", value: "120+", icon: <FaUsers className="text-purple-400" /> }
      ],
      description: "An independent artist needed visibility for their debut EP. We executed a Spotify growth campaign focusing on organic playlist pitching and listener retention, significantly boosting their monthly listeners."
    },
    {
      title: "Tech Reviewer Growth",
      category: "Channel SEO & Shorts",
      icon: <FaYoutube className="text-3xl text-red-500" />,
      stats: [
        { label: "Shorts Views", value: "5M+", icon: <FaArrowUp className="text-green-400" /> },
        { label: "Watch Time", value: "+300%", icon: <FaUsers className="text-purple-400" /> }
      ],
      description: "By repurposing long-form tech reviews into highly engaging YouTube Shorts and optimizing metadata, we helped this creator dominate search rankings and capture a massive short-form audience."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-clip">
      {/* GLOBAL AMBIENT BACKGROUND */}
      <AnimatedBackground />

      <Navbar />
      
      <main className="flex-grow pt-24 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Our Success Stories</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We take pride in our clients' growth. Explore some of our recent campaigns and see the tangible impact of our premium digital promotion strategies.
            </p>
          </div>

          {/* Case Studies Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            {caseStudies.map((study, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-purple-500/40 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl -mr-10 -mt-10 rounded-full transition-all duration-500 group-hover:scale-150" />
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <span className="text-sm font-bold tracking-wider text-purple-400 uppercase bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                    {study.category}
                  </span>
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                    {study.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{study.title}</h3>
                <p className="text-gray-400 mb-8 leading-relaxed relative z-10">
                  {study.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-auto relative z-10">
                  {study.stats.map((stat, idx) => (
                    <div key={idx} className="bg-black/30 p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        {stat.icon}
                        <span className="text-2xl font-bold text-white">{stat.value}</span>
                      </div>
                      <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section Imported from Landing Page */}
        <div className="border-t border-purple-500/20 pt-10">
          <Reviews />
        </div>
      </main>

      <Footer />
    </div>
  );
}
