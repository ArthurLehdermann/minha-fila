import type { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    {
      url: `${SITE_ORIGIN}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          'pt-BR': `${SITE_ORIGIN}/`,
          en: `${SITE_ORIGIN}/en`,
          es: `${SITE_ORIGIN}/es`,
        },
      },
    },
    {
      url: `${SITE_ORIGIN}/en`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'pt-BR': `${SITE_ORIGIN}/`,
          en: `${SITE_ORIGIN}/en`,
          es: `${SITE_ORIGIN}/es`,
        },
      },
    },
    {
      url: `${SITE_ORIGIN}/es`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'pt-BR': `${SITE_ORIGIN}/`,
          en: `${SITE_ORIGIN}/en`,
          es: `${SITE_ORIGIN}/es`,
        },
      },
    },
  ]
}
