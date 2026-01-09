import React, { useState, useCallback, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { API_ENDPOINTS } from '@/config/api';
import { servicesService } from '@/services/servicesService';

type FormData = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

// Hardcoded core services mapping (slug to display name)
const CORE_SERVICES = [
  { slug: 'bpo', name: 'BPO Services' },
  { slug: 'kpo', name: 'KPO Services' },
  { slug: 'legal', name: 'Legal Services' },
  { slug: 'recruitment', name: 'Recruitment' },
  { slug: 'it', name: 'IT Services' },
  { slug: 'brand-promotion', name: 'Brand Promotion & Marketing' },
  { slug: 'support', name: 'Customer Support' },
];

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [activeServices, setActiveServices] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchActiveServices = async () => {
      try {
        const response = await servicesService.getActiveServices();
        if (response.success) {
          const enabledSlugs = response.data
            .filter((s: any) => s.isActive)
            .map((s: any) => s.slug);

          const filtered = CORE_SERVICES
            .filter(service => enabledSlugs.includes(service.slug))
            .map(service => service.name);

          setActiveServices(filtered.length > 0 ? filtered : ['Other']);
        }
      } catch (error) {
        console.error('Failed to fetch services for contact dropdown:', error);
        setActiveServices(['BPO Services', 'IT Services', 'Recruitment', 'Other']); // Fallback
      }
    };
    fetchActiveServices();
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
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
  }, [formData]);

  return (
    <div className="relative bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
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
                className="w-full px-4 py-3 min-h-[44px] bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all duration-200 text-base"
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
                  className="w-full px-4 py-3 min-h-[44px] bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all duration-200 text-base"
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
                  className="w-full px-4 py-3 min-h-[44px] bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all duration-200 text-base"
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
                className="w-full px-4 py-3 min-h-[44px] bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 transition-all duration-200 appearance-none text-base"
              >
                <option value="">Select a service</option>
                {activeServices.map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
                {!activeServices.includes('Other') && <option value="Other">Other</option>}
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
                className="w-full px-4 py-3 min-h-[120px] bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 transition-all duration-200 resize-none text-base"
                placeholder="Tell us about your project..."
              ></textarea>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 min-h-[52px] touch-manipulation"
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
  );
}
