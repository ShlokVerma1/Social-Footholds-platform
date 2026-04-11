'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { enquiryAPI } from '@/lib/api';
import { servicesData, faqData } from '@/constants/data';

export default function SupportHub() {
  const [openFaq, setOpenFaq] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', message: '', service: '', channel_link: '' });
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await enquiryAPI.create(enquiryForm);
      setEnquirySubmitted(true);
      setEnquiryForm({ name: '', email: '', message: '', service: '', channel_link: '' });
      setTimeout(() => setEnquirySubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    }
  };

  return (
    <>
      {/* FAQ Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-400">Everything you need to know about our services</p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4 mb-16">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.3, delay: index * 0.04, ease: 'easeOut' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex justify-between items-center focus:outline-none"
                >
                  <h3 className="text-lg font-semibold text-white text-left pr-4">{faq.q}</h3>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="text-purple-400 flex-shrink-0 text-xl" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-gray-400 font-medium leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Combined Support & Contact Hub */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.1)] flex flex-col lg:flex-row gap-12 lg:gap-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Left Side: Direct Contact */}
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Still have questions?</h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">No worries! We&apos;re here to help.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl text-lg font-semibold transition shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Connect on WhatsApp
              </a>
              <a
                href="mailto:team@socialfootholds.com"
                className="flex flex-1 items-center justify-center gap-3 btn-shimmer bg-gradient-to-r hover:bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl text-lg font-semibold transition shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
            </div>
            <div className="bg-white/5 border border-purple-500/20 p-4 rounded-xl inline-block mt-auto w-fit">
              <p className="text-gray-400 text-sm">
                Email: <a href="mailto:team@socialfootholds.com" className="text-purple-400 hover:text-purple-300 font-semibold ml-1">team@socialfootholds.com</a>
              </p>
            </div>
            <div className="bg-white/5 border border-purple-500/20 p-4 rounded-xl inline-block w-fit">
              <p className="text-gray-400 text-sm flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">📍</span>
                <span>117 South Lexington Street Ste 100<br />Harrisonville, MO 64701</span>
              </p>
            </div>
          </div>

          {/* Right Side: Enquiry Form */}
          <div className="flex-[1.2] bg-black/40 p-8 rounded-2xl border border-white/10">
            <h3 className="text-3xl font-bold text-white mb-2">Not sure what your channel needs?</h3>
            <p className="text-gray-400 mb-8">Get an expert to help you! Share your details and we'll guide you to the perfect service.</p>

            {enquirySubmitted && (
              <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg mb-6 text-center">
                ✓ Thank you! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  className="bg-white/5 focus:bg-white/10 form-input-glow border border-purple-500/30 text-white px-4 py-3 rounded-lg w-full transition"
                  data-testid="enquiry-name-input"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  className="bg-white/5 focus:bg-white/10 form-input-glow border border-purple-500/30 text-white px-4 py-3 rounded-lg w-full transition"
                  data-testid="enquiry-email-input"
                />
              </div>
              <select
                value={enquiryForm.service}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, service: e.target.value })}
                className="w-full bg-white/5 focus:bg-white/10 form-input-glow border border-purple-500/30 text-white px-4 py-3 rounded-lg transition"
              >
                <option value="" className="bg-gray-900">Select a Service (Optional)</option>
                {servicesData.map((service, idx) => (
                  <option key={idx} value={service.name} className="bg-gray-900">{service.name}</option>
                ))}
              </select>
              <input
                type="url"
                placeholder="Your Channel/Video Link (Optional)"
                value={enquiryForm.channel_link}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, channel_link: e.target.value })}
                className="w-full bg-white/5 focus:bg-white/10 form-input-glow border border-purple-500/30 text-white px-4 py-3 rounded-lg transition"
                data-testid="enquiry-channel-link-input"
              />
              <textarea
                placeholder="Your Message"
                required
                rows="4"
                value={enquiryForm.message}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                className="w-full bg-white/5 focus:bg-white/10 form-input-glow border border-purple-500/30 text-white px-4 py-3 rounded-lg transition"
                data-testid="enquiry-message-input"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.1 }}
                className="btn-shimmer relative overflow-hidden w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition mt-2"
                data-testid="enquiry-submit-button"
              >
                Send Message
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  );
}
