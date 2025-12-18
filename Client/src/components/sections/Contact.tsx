import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Copy, Check, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fadeIn } from '@/lib/utils';
import { API_ENDPOINTS } from '@/config/api';

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
      // Get Web3Forms access key from environment variable
      const web3formsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'f58b4191-d670-4d85-890a-fb605d1997ed';
      
      console.log('📧 Attempting to send email via Web3Forms...');
      console.log('Access Key:', web3formsAccessKey.substring(0, 10) + '...');
      
      // Call Web3Forms API from client-side (required for free plan)
      try {
        const payload = {
          access_key: web3formsAccessKey,
          subject: `New Contact Form Submission${formData.service ? ` - ${formData.service}` : ''}`,
          from_name: formData.name,
          reply_to: formData.email,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          service: formData.service || '',
          message: formData.message,
        };

        console.log('Web3Forms Payload:', { ...payload, access_key: '***' });

        const web3formsResponse = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const web3formsResult = await web3formsResponse.json();
        
        console.log('Web3Forms Response Status:', web3formsResponse.status);
        console.log('Web3Forms Response:', web3formsResult);

        if (!web3formsResponse.ok || !web3formsResult.success) {
          console.error('❌ Web3Forms email failed:', {
            status: web3formsResponse.status,
            success: web3formsResult.success,
            message: web3formsResult.message,
            error: web3formsResult.error,
          });
          
          // Show user-friendly error if email fails
          if (web3formsResult.message) {
            console.warn('Email delivery issue:', web3formsResult.message);
          }
        } else {
          console.log('✅ Email sent successfully via Web3Forms');
          console.log('Message ID:', web3formsResult.messageId);
        }
      } catch (web3formsError: any) {
        console.error('❌ Web3Forms network error:', web3formsError);
        console.error('Error details:', {
          message: web3formsError.message,
          stack: web3formsError.stack,
        });
        // Continue even if Web3Forms fails - we'll still save to backend
      }

      // Also save to backend for admin access
      const response = await fetch(API_ENDPOINTS.contact.submit, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || err?.message || 'Failed to submit');
      }
      
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section 
      id="contact" 
      className={`relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-white via-purple-50/30 to-blue-50/30 ${!showHeader ? 'pt-4 sm:pt-6' : ''}`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Section Header */}
        {showHeader && (
          <motion.div 
            className="text-center max-w-4xl mx-auto mb-12 sm:mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div
              variants={fadeIn('up', 0.2)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200/50 mb-6"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700 uppercase tracking-wider">Get In Touch</span>
            </motion.div>
            
            <motion.h2 
              variants={fadeIn('up', 0.3)}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent"
            >
              Let's Discuss Your Project
            </motion.h2>
            
            <motion.p 
              variants={fadeIn('up', 0.4)}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Have a question or want to work together? Fill out the form below and we'll get back to you as soon as possible.
            </motion.p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Modern Contact Form */}
          <motion.div 
            className="order-2 lg:order-1"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn('right', 0.2)}
          >
            <div className="relative bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-bl-full opacity-50"></div>
              
              {status === 'success' ? (
                <div className="relative z-10 text-center py-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h3>
                  <p className="text-gray-600 mb-8 text-lg">Your message has been sent successfully. We'll get back to you soon!</p>
                  <Button 
                    onClick={() => setStatus('idle')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Send us a message</h3>
                  
                  {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-700">
                          There was an error submitting your message. Please try again.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
                          placeholder="+91 90129 50370"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">Service Interest</label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 transition-all duration-200 appearance-none"
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all duration-200 resize-none"
                        placeholder="Tell us about your project..."
                      ></textarea>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>

          {/* Modern Contact Info */}
          <motion.div
            className="space-y-6 order-1 lg:order-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn('left', 0.2)}
          >
            {/* Contact Information Card */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Have questions about our services or want to discuss a project? Reach out to us using the information below.
              </p>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Email</h4>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <a href="mailto:info@careermapsolutions.com" className="text-gray-900 hover:text-purple-600 transition-colors font-medium break-all">
                        info@careermapsolutions.com
                      </a>
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
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-300 transition-colors text-xs font-medium flex items-center gap-1"
                        >
                          {emailCopied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                          {emailCopied ? 'Copied' : 'Copy'}
                        </button>
                        <a
                          href="mailto:info@careermapsolutions.com"
                          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all text-xs font-semibold shadow-md"
                        >
                          Email Us
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Phone</h4>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <a href="tel:+919012950370" className="text-gray-900 hover:text-green-600 transition-colors font-medium">
                        +91 90129 50370
                      </a>
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
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-green-600 hover:border-green-300 transition-colors text-xs font-medium flex items-center gap-1"
                        >
                          {phoneCopied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                          {phoneCopied ? 'Copied' : 'Copy'}
                        </button>
                        <a
                          href="tel:+919012950370"
                          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all text-xs font-semibold shadow-md"
                        >
                          Call Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Location</h4>
                    <p className="text-gray-900 font-medium">Gurgaon, Haryana, India</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Business Hours Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Business Hours</h4>
              </div>
              <ul className="space-y-4">
                <li className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                  <span className="text-gray-600 font-medium">Monday - Friday</span>
                  <span className="text-gray-900 font-bold">9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                  <span className="text-gray-500">Saturday</span>
                  <span className="text-gray-500">Closed</span>
                </li>
                <li className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200">
                  <span className="text-gray-500">Sunday</span>
                  <span className="text-gray-500">Closed</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
