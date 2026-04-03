import { lexicalEditor, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical'
import type { Access, Where } from 'payload'
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

const readAccess: Access = ({ req: { user } }) => {
  if (!user) return false

  const strategy = (user as any)._strategy

  if (strategy === 'local-jwt') return true

  const query: Where = {
    and: [
      {
        _status: {
          equals: 'published',
        },
      },
      {
        publishedAt: {
          less_than_equal: new Date().toISOString(),
        },
      },
    ],
  }

  return query
}
export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', '_status', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: readAccess,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 8000, // Time in ms between saves (default is 8000)
      },
    },
    maxPerDoc: 50,
  },

  fields: [
    { name: 'title', type: 'text', maxLength: 65, label: 'Main Heading', required: true },
    { name: 'short_quote', type: 'text', maxLength: 65, label: 'Short Quote', required: true },
    {
      name: 'tags',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'tag',
          type: 'text',
          maxLength: 40,
          required: false,
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    slugField({
      name: 'slug',
      useAsSlug: 'title',
      required: true,
    }),
    {
      name: 'text',
      type: 'richText',
      label: 'Article',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, EXPERIMENTAL_TableFeature()],
      }),
      required: true,
    },
    {
      name: 'cover_image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publish At',
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'Leave as-is to publish immediately, or set a future date to schedule.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
  ],
}
