import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useServices } from '@/context/ServiceContext';

type NavItem = {
  name: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string; description: string }[];
};

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Services',
    href: '/services',
    hasDropdown: true,
    dropdownItems: []
  },
  { name: 'About', href: '/about' },
  { name: 'Team', href: '/team' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const { services } = useServices();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest('header')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Handle dropdown hover with delay
  const handleDropdownEnter = (itemName: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setHoveredDropdown(itemName);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredDropdown(null);
    }, 150); // Small delay to allow moving to dropdown
    setDropdownTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-gradient-to-r from-black/90 to-purple-900/90 backdrop-blur-xl shadow-2xl border-b border-purple-900/30"
          : "bg-gradient-to-r from-black/90 to-purple-900/90 backdrop-blur-lg"
      )}
      style={{
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'blur(16px) saturate(180%)',
      }}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <a
              href="/"
              className="flex items-center transition-opacity duration-300 hover:opacity-80"
            >
              <img
                src="/logo2.png"
                alt="CareerMap Solutions"
                className="h-18 sm:h-24 lg:h-28 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => {
              // Dynamically populate dropdown items if it's the Services menu
              const displayItems = item.name === 'Services'
                ? services.filter(s => s.isActive).map(s => ({
                  name: s.name,
                  href: `/services/${s.slug}`,
                  description: s.shortDescription
                }))
                : item.dropdownItems;

              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && handleDropdownEnter(item.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <a
                    href={item.href}
                    className="text-sm xl:text-base text-gray-200 hover:text-white transition-colors font-medium hover:scale-105 duration-300 relative group flex items-center"
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown className="ml-1 w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </a>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && hoveredDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
                      onMouseEnter={() => handleDropdownEnter(item.name)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="p-2">
                        {displayItems?.map((dropdownItem, index) => (
                          <motion.a
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                  {dropdownItem.name}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors line-clamp-1">
                                  {dropdownItem.description}
                                </p>
                              </div>
                              <div className="w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2"></div>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                      <div className="border-t border-gray-200/50 p-3 bg-gray-50/50">
                        <a
                          href="/services"
                          className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors flex items-center justify-center"
                        >
                          View All Services
                          <ChevronDown className="ml-1 w-3 h-3 rotate-[-90deg]" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:+919012950370"
              className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">+91 90129 50370</span>
            </a>
            <a
              href="#contact"
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg min-h-[44px] touch-manipulation inline-flex items-center justify-center"
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2.5 text-white hover:text-purple-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-md min-h-[44px] min-w-[44px] touch-manipulation flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-gradient-to-b from-black/95 to-purple-900/95 backdrop-blur-xl border-t border-purple-800/50 overflow-hidden"
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            <div className="container mx-auto px-3 sm:px-4 py-4">
              {/* Mobile Contact Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4 mb-6 pb-4 border-b border-purple-800/50">
                <a
                  href="tel:+919012950370"
                  className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+91 90129 50370</span>
                </a>
                <a
                  href="mailto:info@careermapsolutions.com"
                  className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>info@careermapsolutions.com</span>
                </a>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navItems.map((item, index) => (
                  <div key={item.name}>
                    <motion.a
                      href={item.href}
                      className="py-3.5 px-4 text-gray-200 hover:text-white hover:bg-purple-900/30 transition-all duration-300 font-medium rounded-lg group flex items-center justify-between min-h-[48px] touch-manipulation"
                      onClick={() => setMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="flex items-center">
                        {item.name}
                        {item.hasDropdown && (
                          <ChevronDown className="ml-2 w-3 h-3" />
                        )}
                      </span>
                      <span className="w-0 group-hover:w-6 h-0.5 bg-purple-400 transition-all duration-300"></span>
                    </motion.a>

                    {/* Mobile Services Dropdown */}
                    {item.hasDropdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 mt-1 space-y-1"
                      >
                        {(() => {
                          const displayItems = item.name === 'Services'
                            ? services.filter(s => s.isActive).map(s => ({
                              name: s.name,
                              href: `/services/${s.slug}`,
                              description: s.shortDescription
                            }))
                            : item.dropdownItems;

                          return displayItems?.map((dropdownItem, subIndex) => (
                            <motion.a
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block py-3 px-4 text-sm text-gray-300 hover:text-white hover:bg-purple-800/30 transition-all duration-300 rounded-lg min-h-[44px] touch-manipulation"
                              onClick={() => setMobileMenuOpen(false)}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (index * 0.1) + (subIndex * 0.05) }}
                            >
                              <div className="font-medium">{dropdownItem.name}</div>
                              <div className="text-xs text-gray-400 mt-0.5">{dropdownItem.description}</div>
                            </motion.a>
                          ));
                        })()}
                      </motion.div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile CTA Button */}
              <motion.div
                className="mt-6 pt-4 border-t border-purple-800/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a
                  href="#contact"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-center font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 block min-h-[48px] touch-manipulation flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started Today
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
