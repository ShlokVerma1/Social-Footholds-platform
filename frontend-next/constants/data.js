import { FaYoutube, FaMusic, FaSearch, FaFilm, FaMobileAlt, FaGlobe } from 'react-icons/fa';

export const servicesData = [
  {
    icon: <FaYoutube className="text-4xl text-red-500" />,
    name: 'Video Promotion',
    description: 'Boost your YouTube videos to reach more audience faster',
    features: ['Targeted reach', 'Geography-specific', 'Fast delivery']
  },
  {
    icon: <FaMusic className="text-4xl text-green-500" />,
    name: 'Music Promotion',
    description: 'Promote your music on Spotify and Apple Music',
    features: ['Playlist placement', 'Organic growth', 'Stream boost']
  },
  {
    icon: <FaSearch className="text-4xl text-blue-500" />,
    name: 'Channel SEO',
    description: 'Optimize your channel to rank better in search',
    features: ['SEO optimization', 'Real gain in watch time and subscribers', 'Monetization growth']
  },
  {
    icon: <FaFilm className="text-4xl text-purple-500" />,
    name: 'Video Editing',
    description: 'Professional editing for your YouTube content',
    features: ['Cinematic Color Correction & Visual Grading', 'Audio Engineering & Noise Reduction', 'Seamless Transitions & Visual Flow']
  },
  {
    icon: <FaMobileAlt className="text-4xl text-pink-500" />,
    name: 'Shorts Creation',
    description: 'Create engaging shorts from long-form videos',
    features: ['Long form to short form videos', 'Content ideas', 'Shorts editing']
  },
  {
    icon: <FaGlobe className="text-4xl text-indigo-500" />,
    name: 'Web & Blogs',
    description: 'Build your online presence with web pages',
    features: ['Landing page', 'Blog writing', 'Books/content selling website']
  }
];

export const faqData = [
  { q: '1. Is your promotion safe for my YouTube channel or music profile?', a: 'Yes. We use organic and platform-compliant strategies. No bots, no fake engagement.' },
  { q: '2. Do you guarantee results?', a: 'We guarantee a minimum level of growth and visibility based on the selected service. Our focus is on delivering real audience reach and measurable improvements.' },
  { q: '3. How long does it take to see results?', a: 'Most creators start seeing results within 3–14 days, depending on the service.' },
  { q: '4. How do I get started?', a: "Simply choose a service, complete payment, and submit your channel or music link. We'll take care of the rest." },
  { q: '5. Can I track my progress?', a: 'Yes. You will receive updates, reports, and progress tracking throughout your service.' },
  { q: '6. What information do I need to provide?', a: 'Usually: YouTube channel link, Spotify/Apple Music link, or content details (if required).' },
  { q: '7. Do you need access to my account?', a: 'We do not require full login access. However, we may request limited access (like YouTube Studio permissions) to better optimize and manage your growth.' },
  { q: '8. Can I cancel my order?', a: 'Yes. You can cancel your order within 7 days and receive a full refund.' },
];
