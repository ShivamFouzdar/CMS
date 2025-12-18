import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { APP_BASE_URL } from '@/config/api';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  canonicalUrl?: string;
  keywords?: string[];
  type?: 'website' | 'article' | 'profile' | 'book';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function SEO({
  title,
  description = 'Expert business solutions for your success',
  image = '/images/og-image.jpg',
  canonicalUrl,
  keywords = [
    'business process outsourcing',
    'BPO',
    'knowledge process outsourcing',
    'KPO',
    'IT solutions',
    'recruitment',
    'legal services',
    'business consulting',
    'career solutions',
    'professional services'
  ],
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = []
}: SEOProps) {
  const { pathname } = useLocation();
  const siteUrl = APP_BASE_URL;
  const siteTitle = title 
    ? `${title} | CareerMap Solutions` 
    : 'CareerMap Solutions | Expert Business Solutions';
  
  const fullUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : `${siteUrl}${pathname}`;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Default structured data (schema.org)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebPage',
    name: siteTitle,
    url: fullUrl,
    description,
    publisher: {
      '@type': 'Organization',
      name: 'CareerMap Solutions',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`
      }
    },
    ...(type === 'article' && {
      headline: title,
      image: fullImageUrl,
      author: {
        '@type': 'Person',
        name: author || 'CareerMap Solutions'
      },
      publisher: {
        '@type': 'Organization',
        name: 'CareerMap Solutions',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/logo.png`
        }
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullUrl
      },
      ...(section && { articleSection: section }),
      ...(tags.length > 0 && { keywords: tags.join(', ') })
    })
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content={author || 'CareerMap Solutions'} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="CareerMap Solutions" />
      <meta property="og:locale" content="en_US" />
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta name="twitter:creator" content="@careermapsol" />
      <meta name="twitter:site" content="@careermapsol" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Favicon */}
      <link rel="icon" type="image/png" href="/favicon.ico" sizes="32x32" />
      <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="theme-color" content="#2563eb" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
    </Helmet>
  );
}
