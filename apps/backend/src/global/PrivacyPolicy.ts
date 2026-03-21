import { lexicalEditor, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'
export const PrivacyPolicy: GlobalConfig = {
  slug: 'privacy-policy',
  access: {
    read: ({ req: { user } }) => {
      return Boolean(user)
    },
  },

  versions: {
    drafts: {
      autosave: {
        interval: 8000, // Time in ms between saves (default is 8000)
      },
    },
  },

  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Privacy Policy',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, EXPERIMENTAL_TableFeature()],
      }),
      required: true,
    },
  ],
}
