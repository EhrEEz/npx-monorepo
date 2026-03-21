import { lexicalEditor, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'
export const TermsOfService: GlobalConfig = {
  slug: 'terms-of-service',
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
      label: 'Terms of Service',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, EXPERIMENTAL_TableFeature()],
      }),
      required: true,
    },
  ],
}
