import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalPath: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object;
}

export const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  ogImage = '/og-image.jpg',
  canonicalPath,
  type = 'website',
  structuredData
}: SEOHeadProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'es';
  const fullUrl = `https://talamo.app${canonicalPath}`;
  const ogImageUrl = `https://talamo.app${ogImage}`;

  // Hreflang URLs
  const hreflangs = [
    { lang: 'es', url: `https://talamo.app${canonicalPath}` },
    { lang: 'en', url: `https://talamo.app/en${canonicalPath}` },
    { lang: 'pt', url: `https://talamo.app/pt${canonicalPath}` },
  ];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Hreflang Tags */}
      {hreflangs.map(({ lang: hrefLang, url }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`https://talamo.app${canonicalPath}`} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:locale" content={lang === 'es' ? 'es_ES' : lang === 'pt' ? 'pt_BR' : 'en_US'} />
      <meta property="og:site_name" content="Tálamo Trading" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
