export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Tálamo Trading",
  "url": "https://talamo.app",
  "logo": "https://talamo.app/logo.png",
  "description": "Academia de trading profesional, señales verificadas y copy trading con Exness",
  "sameAs": [],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "availableLanguage": ["Spanish", "English", "Portuguese"]
  }
});

export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Tálamo Trading",
  "url": "https://talamo.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://talamo.app/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
});

export const getCourseSchema = (courseName: string, description: string) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": courseName,
  "description": description,
  "provider": {
    "@type": "Organization",
    "name": "Tálamo Trading",
    "url": "https://talamo.app"
  },
  "educationalLevel": "Beginner to Advanced",
  "coursePrerequisites": "Basic understanding of financial markets",
  "availableLanguage": ["es", "en", "pt"],
  "isAccessibleForFree": false,
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": "PT40H"
  }
});

export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const getArticleSchema = (title: string, description: string, datePublished: string, author: string = "Tálamo Trading") => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "author": {
    "@type": "Organization",
    "name": author
  },
  "publisher": {
    "@type": "Organization",
    "name": "Tálamo Trading",
    "logo": {
      "@type": "ImageObject",
      "url": "https://talamo.app/logo.png"
    }
  },
  "datePublished": datePublished,
  "dateModified": datePublished
});
