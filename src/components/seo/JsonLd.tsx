import React from 'react';

interface JsonLdProps {
  type: 'article' | 'faq' | 'organization' | 'softwareApplication';
  data: any;
}

export const JsonLd: React.FC<JsonLdProps> = ({ type, data }) => {
  let jsonLdContent = {};

  switch (type) {
    case 'article':
      jsonLdContent = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        datePublished: data.publishedAt,
        dateModified: data.updatedAt,
        author: {
          '@type': 'Organization',
          name: data.author || 'Your Company Name',
        },
        publisher: {
          '@type': 'Organization',
          name: data.publisher || 'Your Company Name',
          logo: {
            '@type': 'ImageObject',
            url: data.logo || 'https://yourcompany.com/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url || `https://yourcompany.com/blog/${data.slug}`,
        },
      };
      break;

    case 'faq':
      jsonLdContent = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faqs?.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })) || [],
      };
      break;

    case 'organization':
      jsonLdContent = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name,
        description: data.description,
        url: data.url,
        logo: data.logo,
      };
      break;

    case 'softwareApplication':
      jsonLdContent = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: data.name,
        applicationCategory: data.applicationCategory,
        operatingSystem: data.operatingSystem,
        offers: data.offers,
        description: data.description,
        provider: data.provider,
      };
      break;

    default:
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContent) }}
    />
  );
};