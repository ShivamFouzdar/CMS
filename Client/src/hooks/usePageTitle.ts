import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UsePageTitleOptions {
  /**
   * The page title template with a %s placeholder for the page-specific title
   * @default "%s | CareerMap Solutions"
   */
  titleTemplate?: string;
  
  /**
   * The default title when no title is provided
   * @default "CareerMap Solutions"
   */
  defaultTitle?: string;
  
  /**
   * The default meta description
   */
  defaultDescription?: string;
}

/**
 * A custom hook to update the page title and meta description
 * @param title - The page title (without the site name)
 * @param description - The meta description (optional, falls back to default)
 * @param options - Additional options for title formatting
 */
export function usePageTitle(
  title?: string,
  description?: string,
  options: UsePageTitleOptions = {}
) {
  const {
    titleTemplate = '%s | CareerMap Solutions',
    defaultTitle = 'CareerMap Solutions | Expert Business Solutions',
    defaultDescription = 'Expert business solutions including BPO, KPO, IT services, recruitment, and legal services. Partner with us for your business growth.'
  } = options;
  
  const location = useLocation();
  
  useEffect(() => {
    // Set the page title
    let pageTitle = defaultTitle;
    
    if (title) {
      pageTitle = titleTemplate.replace('%s', title);
    }
    
    document.title = pageTitle;
    
    // Update meta description
    const metaDescription = description || defaultDescription;
    let metaDescriptionTag = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    
    if (!metaDescriptionTag) {
      metaDescriptionTag = document.createElement('meta');
      metaDescriptionTag.name = 'description';
      document.head.appendChild(metaDescriptionTag);
    }
    
    metaDescriptionTag.content = metaDescription;
    
    // Add canonical URL
    const siteUrl = import.meta.env.VITE_APP_BASE_URL || 'https://careermapsolutions.com';
    const canonicalUrl = `${siteUrl}${location.pathname}`.replace(/\/+$/, '');
    
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    
    canonicalLink.href = canonicalUrl;
    
    // Cleanup function to reset title and description when component unmounts
    return () => {
      document.title = defaultTitle;
      
      // Reset to default description if this was the last component using the hook
      if (metaDescriptionTag) {
        metaDescriptionTag.content = defaultDescription;
      }
    };
  }, [title, description, titleTemplate, defaultTitle, defaultDescription, location.pathname]);
  
  // Return the current page title (without the template)
  return title || defaultTitle;
}

/**
 * A higher-order component that wraps a component with the usePageTitle hook
 * @param Component - The component to wrap
 * @param title - The page title
 * @param description - The meta description (optional)
 * @param options - Additional options for title formatting
 */
export function withPageTitle<P>(
  Component: React.ComponentType<P>,
  title?: string,
  description?: string,
  options?: UsePageTitleOptions
) {
  return function WithPageTitle(props: P) {
    usePageTitle(title, description, options);
    return <Component {...props as any} />;
  };
}
