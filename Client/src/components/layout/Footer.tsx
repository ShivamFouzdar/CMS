import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

// Custom X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/people/CareerMap-Solutions/61581367203854/',
    icon: Facebook,
  },
  {
    name: 'X',
    href: 'https://x.com/CareerMap_Com',
    icon: XIcon,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/careermapsolutions_official/?hl=en',
    icon: Instagram,
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: Linkedin,
  },
];

const contactInfo = [
  {
    icon: Mail,
    text: 'info@careermapsolutions.com',
    href: 'mailto:info@careermapsolutions.com',
  },
  {
    icon: Phone,
    text: '+91 90129 50370',
    href: 'tel:+919012950370',
  },
  {
    icon: MapPin,
    text: 'Gurgaon, Haryana, India',
    href: 'https://maps.google.com',
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-purple-900/50 to-gray-900 text-gray-300 border-t border-purple-900/30">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">CareerMap <span className="text-purple-300">Solutions</span></h3>
            <p className="mb-4 sm:mb-6 text-gray-300 text-sm sm:text-base leading-relaxed">
              Empowering businesses with comprehensive outsourcing solutions to drive growth and efficiency 
              in today's competitive landscape.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white transition-all duration-300 hover:scale-110 p-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 border border-purple-600/50 hover:border-purple-400 group"
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 group-hover:drop-shadow-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: 'Our Services', href: '/services' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Case Studies', href: '#' },
                { name: 'Blog', href: '#' }
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="text-gray-300 hover:text-purple-300 transition-colors hover:pl-1 sm:hover:pl-2 block text-sm sm:text-base"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Contact Us</h4>
            <ul className="space-y-3 sm:space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start space-x-2 sm:space-x-3 group">
                  <div className="p-1 sm:p-1.5 bg-purple-900/50 rounded-lg group-hover:bg-purple-800/50 transition-colors flex-shrink-0">
                    <item.icon className="h-3 w-3 sm:h-4 sm:w-4 text-purple-300 mt-0.5" />
                  </div>
                  <a 
                    href={item.href} 
                    className="text-gray-300 hover:text-purple-300 transition-colors text-xs sm:text-sm break-all sm:break-normal"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-purple-900/30 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
            &copy; {currentYear} <span className="text-purple-300">CareerMap Solutions</span>. All rights reserved.
          </p>
          <div className="flex space-x-4 sm:space-x-6">
            <a href="/privacy-policy" className="text-xs sm:text-sm text-gray-400 hover:text-purple-300 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-xs sm:text-sm text-gray-400 hover:text-purple-300 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
