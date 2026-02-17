import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Base',
  },
  upload: {
    disableLocalStorage: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'small',
        width: 400,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'card',
        width: 768,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'tablet',
        width: 1024,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'desktop',
        width: 1920,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    formatOptions: {
      format: 'webp',
      options: {
        quality: 80, // Adjust compression level here
      },
    },
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
