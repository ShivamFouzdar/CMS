import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/forms/Button';
import { getCookieConsent, saveCookieConsent } from '@/lib/security';
import { trackEvent } from '@/lib/analytics';

/**
 * Props for the CookieConsentBanner component
 */
type CookieConsentBannerProps = {
  /**
   * Whether to show the cookie consent banner
   * @default true
   */
  showBanner?: boolean;
  
  /**
   * Callback function when the user accepts the cookie policy
   */
  onAccept?: (preferences: {
    necessary: boolean;
    preferences: boolean;
    analytics: boolean;
    marketing: boolean;
  }) => void;
  
  /**
   * Callback function when the user rejects the cookie policy
   */
  onReject?: () => void;
  
  /**
   * Additional class name for the banner
   */
  className?: string;
  
  /**
   * The position of the banner
   * @default 'bottom'
   */
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  
  /**
   * The style of the banner
   * @default 'standard'
   */
  style?: 'standard' | 'minimal' | 'floating';
};

/**
 * A customizable cookie consent banner that helps with GDPR and other privacy regulations
 */
export function CookieConsentBanner({
  showBanner = true,
  onAccept,
  onReject,
  className = '',
  position = 'bottom',
  style = 'standard',
}: CookieConsentBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState({
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false,
  });
  
  // Check if the user has already given consent
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedConsent = getCookieConsent();
    const hasGivenConsent = localStorage.getItem('cookie_consent_given');
    
    setConsent(savedConsent);
    
    // Only show the banner if the user hasn't given consent yet
    if (!hasGivenConsent && showBanner) {
      // Small delay to ensure the page has loaded
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [showBanner]);
  
  /**
   * Handle accepting all cookies
   */
  const handleAcceptAll = () => {
    const newConsent = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    };
    
    saveCookieConsent(newConsent);
    setConsent(newConsent);
    setIsOpen(false);
    
    // Track the acceptance in analytics
    trackEvent({
      action: 'cookie_consent_accepted',
      category: 'Cookie Consent',
      consent_type: 'all',
      preferences: newConsent.preferences,
      analytics: newConsent.analytics,
      marketing: newConsent.marketing
    });
    
    // Call the onAccept callback if provided
    if (onAccept) {
      onAccept(newConsent);
    }
    
    // Mark that the user has given consent
    localStorage.setItem('cookie_consent_given', 'true');
  };
  
  /**
   * Handle rejecting all non-essential cookies
   */
  const handleReject = () => {
    const newConsent = {
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
    };
    
    saveCookieConsent(newConsent);
    setConsent(newConsent);
    setIsOpen(false);
    
    // Track the rejection in analytics
    trackEvent({
      action: 'cookie_consent_rejected',
      category: 'Cookie Consent',
      consent_type: 'all',
      preferences: newConsent.preferences,
      analytics: newConsent.analytics,
      marketing: newConsent.marketing
    });
    
    // Call the onReject callback if provided
    if (onReject) {
      onReject();
    }
    
    // Mark that the user has given consent (even if rejected, to not show the banner again)
    localStorage.setItem('cookie_consent_given', 'true');
  };
  
  /**
   * Handle saving custom cookie preferences
   */
  const handleSavePreferences = () => {
    saveCookieConsent(consent);
    setIsOpen(false);
    
    // Track the custom preferences in analytics (if analytics are enabled)
    if (consent.analytics) {
      trackEvent({
        action: 'cookie_consent_updated',
        category: 'Cookie Consent',
        preferences: consent.preferences,
        analytics: consent.analytics,
        marketing: consent.marketing
      });
    }
    
    // Call the onAccept callback if provided
    if (onAccept) {
      onAccept(consent);
    }
    
    // Mark that the user has given consent
    localStorage.setItem('cookie_consent_given', 'true');
  };
  
  /**
   * Toggle a specific cookie category
   */
  const toggleCategory = (category: keyof typeof consent) => {
    // Necessary cookies cannot be disabled
    if (category === 'necessary') return;
    
    setConsent(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };
  
  // Don't render anything if the banner is closed or should not be shown
  if (!isOpen) return null;
  
  // Position classes
  const positionClasses = {
    'top': 'top-0 left-0 right-0',
    'bottom': 'bottom-0 left-0 right-0',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  
  // Style classes
  const styleClasses = {
    standard: 'w-full max-w-4xl mx-auto rounded-lg shadow-lg',
    minimal: 'w-full max-w-2xl mx-auto rounded-lg shadow-sm',
    floating: 'w-96 rounded-xl shadow-xl',
  };
  
  // Determine the appropriate classes based on position and style
  const containerClasses = `
    fixed z-50 p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100
    ${positionClasses[position]}
    ${style === 'floating' ? positionClasses[position] : ''}
    ${styleClasses[style]}
  `;
  
  return (
    <div 
      className={`${containerClasses} ${className}`}
      role="dialog"
      aria-labelledby="cookie-consent-heading"
      aria-describedby="cookie-consent-description"
    >
      <div className="relative">
        {/* Close button */}
        <button
          type="button"
          onClick={handleReject}
          className="absolute top-0 right-0 text-gray-400 hover:text-gray-500"
          aria-label="Close cookie consent banner"
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Banner content */}
        <div className="flex flex-col md:flex-row items-start">
          {/* Icon */}
          <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
            <Cookie className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          
          {/* Main content */}
          <div className="flex-1 mt-3 md:mt-0">
            <h3 
              id="cookie-consent-heading"
              className="text-lg font-medium text-gray-900 dark:text-white"
            >
              We value your privacy
            </h3>
            
            <p 
              id="cookie-consent-description"
              className="mt-2 text-sm text-gray-600 dark:text-gray-300"
            >
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies. You can manage your preferences below.
            </p>
            
            {/* Cookie settings */}
            {showSettings ? (
              <div className="mt-4 space-y-3">
                {/* Necessary cookies - always on */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Necessary</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Essential for the website to function properly.
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="necessary-cookies"
                        checked={true}
                        disabled
                        className="sr-only"
                      />
                      <label
                        htmlFor="necessary-cookies"
                        className="block overflow-hidden h-6 rounded-full bg-blue-500 cursor-pointer"
                      >
                        <span className="block h-6 w-6 rounded-full bg-white transform translate-x-4"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Preferences cookies */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Preferences</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Remember your settings and preferences.
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="preferences-cookies"
                        checked={consent.preferences}
                        onChange={() => toggleCategory('preferences')}
                        className="sr-only"
                      />
                      <label
                        htmlFor="preferences-cookies"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${consent.preferences ? 'bg-blue-500' : 'bg-gray-300'}`}
                      >
                        <span className={`block h-6 w-6 rounded-full bg-white transform ${consent.preferences ? 'translate-x-4' : 'translate-x-0'} transition-transform`}></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Analytics cookies */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Analytics</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="analytics-cookies"
                        checked={consent.analytics}
                        onChange={() => toggleCategory('analytics')}
                        className="sr-only"
                      />
                      <label
                        htmlFor="analytics-cookies"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${consent.analytics ? 'bg-blue-500' : 'bg-gray-300'}`}
                      >
                        <span className={`block h-6 w-6 rounded-full bg-white transform ${consent.analytics ? 'translate-x-4' : 'translate-x-0'} transition-transform`}></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Marketing cookies */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Marketing</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Used to track visitors across websites for advertising purposes.
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="marketing-cookies"
                        checked={consent.marketing}
                        onChange={() => toggleCategory('marketing')}
                        className="sr-only"
                      />
                      <label
                        htmlFor="marketing-cookies"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${consent.marketing ? 'bg-blue-500' : 'bg-gray-300'}`}
                      >
                        <span className={`block h-6 w-6 rounded-full bg-white transform ${consent.marketing ? 'translate-x-4' : 'translate-x-0'} transition-transform`}></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                  <Button
                    type="button"
                    onClick={handleSavePreferences}
                    className="w-full sm:w-auto"
                    variant="primary"
                    size="sm"
                  >
                    Save Preferences
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="w-full sm:w-auto"
                    variant="ghost"
                    size="sm"
                  >
                    Back
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                <Button
                  type="button"
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto"
                  variant="primary"
                  size="sm"
                >
                  Accept All
                </Button>
                
                <Button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  className="w-full sm:w-auto"
                  variant="outline"
                  size="sm"
                >
                  Customize Settings
                </Button>
                
                <Button
                  type="button"
                  onClick={handleReject}
                  className="w-full sm:w-auto"
                  variant="ghost"
                  size="sm"
                >
                  Reject Non-Essential
                </Button>
              </div>
            )}
            
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>
                For more information, please read our{' '}
                <a 
                  href="/privacy-policy" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a 
                  href="/cookie-policy" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cookie Policy
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
