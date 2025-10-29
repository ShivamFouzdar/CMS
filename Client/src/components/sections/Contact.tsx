import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Facebook, Instagram, Linkedin, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fadeIn } from '@/lib/utils';

type FormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const services = [
  'BPO Services',
  'IT Services',
  'Recruitment',
  'Legal Services',
  'KPO Services',
  'Other',
];

interface ContactProps {
  showHeader?: boolean;
}

export function Contact({ showHeader = true }: ContactProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [emailCopied, setEmailCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || '/api';
      const response = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || err?.message || 'Failed to submit');
      }
      
      setStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className={`py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 relative overflow-hidden ${!showHeader ? 'pt-0' : ''}`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 w-full h-full opacity-30 sm:opacity-40 pointer-events-none">
        <div className="absolute -top-10 -right-10 sm:-top-20 sm:-right-20 w-32 h-32 sm:w-64 sm:h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute -bottom-10 -left-10 sm:-bottom-20 sm:-left-20 w-32 h-32 sm:w-64 sm:h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        {/* Section Header - Conditionally Rendered */}
        {showHeader && (
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-8 sm:mb-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6 }
              }
            }}
          >
            <motion.span 
              className="text-purple-600 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 block"
              variants={fadeIn('up', 0.2)}
            >
              Get In Touch
            </motion.span>
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4"
              variants={fadeIn('up', 0.3)}
            >
              Let's Discuss Your Project
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base md:text-lg text-gray-600"
              variants={fadeIn('up', 0.4)}
            >
              Have a question or want to work together? Fill out the form below and we'll get back to you as soon as possible.
            </motion.p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Form */}
          <motion.div 
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 shadow-lg order-2 lg:order-1"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn('right', 0.2)}
          >
            {status === 'success' ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-900/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Your message has been sent successfully. We'll get back to you soon!</p>
                <Button 
                  onClick={() => setStatus('idle')}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm sm:text-base"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Send us a message</h3>
                {status === 'error' && (
                  <div className="bg-red-900/20 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-xs sm:text-sm text-red-200">
                          There was an error submitting your message. Please try again.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all duration-200 text-sm sm:text-base"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-400">*</span></label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all duration-200 text-sm sm:text-base"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all duration-200 text-sm sm:text-base"
                        placeholder="+91 90129 50370"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Service Interest</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all duration-200 appearance-none text-sm sm:text-base"
                    >
                      <option value="" className="bg-gray-50 text-gray-900">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service} className="bg-gray-50 text-gray-900">
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Your Message <span className="text-red-400">*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all duration-200 resize-none text-sm sm:text-base"
                      placeholder="Tell us about your project..."
                    ></textarea>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base"
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <>
                          <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-6 sm:space-y-8 order-1 lg:order-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn('right', 0.2)}
          >
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Contact Information</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                Have questions about our services or want to discuss a project? Reach out to us using the information below or fill out the contact form.
              </p>
              
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-50 p-2 rounded-lg border border-purple-200">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <div className="ml-3 sm:ml-4 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Email</h4>
                        <a href="mailto:info@careermapsolutions.com" className="text-gray-800 hover:text-purple-700 transition-colors text-sm sm:text-base break-all">
                          info@careermapsolutions.com
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText('info@careermapsolutions.com');
                              setEmailCopied(true);
                              setTimeout(() => setEmailCopied(false), 1500);
                            } catch {}
                          }}
                          className="inline-flex items-center px-2.5 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:text-purple-700 hover:border-purple-300 transition-colors text-xs sm:text-sm"
                          aria-label="Copy email address"
                        >
                          {emailCopied ? <Check className="h-3.5 w-3.5 mr-1 text-green-600" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                          {emailCopied ? 'Copied' : 'Copy'}
                        </button>
                        <a
                          href="mailto:info@careermapsolutions.com"
                          className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors text-xs sm:text-sm"
                        >
                          Email Us
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-50 p-2 rounded-lg border border-purple-200">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <div className="ml-3 sm:ml-4 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Phone</h4>
                        <a href="tel:+919012950370" className="text-gray-800 hover:text-purple-700 transition-colors text-sm sm:text-base">
                          +91 90129 50370
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText('+919012950370');
                              setPhoneCopied(true);
                              setTimeout(() => setPhoneCopied(false), 1500);
                            } catch {}
                          }}
                          className="inline-flex items-center px-2.5 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:text-purple-700 hover:border-purple-300 transition-colors text-xs sm:text-sm"
                          aria-label="Copy phone number"
                        >
                          {phoneCopied ? <Check className="h-3.5 w-3.5 mr-1 text-green-600" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                          {phoneCopied ? 'Copied' : 'Copy'}
                        </button>
                        <a
                          href="tel:+919012950370"
                          className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors text-xs sm:text-sm"
                        >
                          Call Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-50 p-2 rounded-lg border border-purple-200">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <div className="ml-3 sm:ml-4 flex-1">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Location</h4>
                    <p className="text-gray-800 text-xs sm:text-sm mt-1">Gurgaon, Haryana, India</p>
                    <div className="mt-2">
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=123%20Business%20Ave%2C%20Suite%20100%2C%20New%20York%2C%20NY%2010001"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-purple-700 hover:text-purple-800 text-xs sm:text-sm font-medium"
                      >
                        Open in Maps
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg">
              <h4 className="font-medium text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">Business Hours</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex justify-between text-gray-600">
                  <span className="text-xs sm:text-sm">Monday - Friday</span>
                  <span className="text-gray-800 font-medium text-xs sm:text-sm">9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between text-gray-500">
                  <span className="text-xs sm:text-sm">Saturday</span>
                  <span className="text-xs sm:text-sm">Closed</span>
                </li>
                <li className="flex justify-between text-gray-400">
                  <span className="text-xs sm:text-sm">Sunday</span>
                  <span className="text-gray-500 text-xs sm:text-sm">Closed</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Follow Us</h3>
              <div className="flex space-x-3 sm:space-x-4">
                {[
                  { name: 'Facebook', icon: Facebook, color: 'text-blue-600', href: 'https://www.facebook.com/people/CareerMap-Solutions/61581367203854/' },
                  { name: 'Instagram', icon: Instagram, color: 'text-pink-600', href: 'https://www.instagram.com/careermapsolutions_official/?hl=en' },
                  { name: 'X', icon: (props: any) => (
                    <svg className={props.className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ), color: 'text-sky-500', href: 'https://x.com/CareerMap_Com' },
                  { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', href: '#' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} hover:opacity-80 transition-opacity`}
                    aria-label={social.name}
                  >
                    <span className="sr-only">{social.name}</span>
                    <social.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
