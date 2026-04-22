import type { CollectionConfig } from 'payload'

export const ServiceApplication: CollectionConfig = {
  slug: 'service-application',
  admin: {
    useAsTitle: 'name',
    group: 'Service',
  },
  access: {
    read: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      maxLength: 200,
      required: true,
    },
    {
      name: 'service',
      label: 'Service',
      type: 'relationship',
      relationTo: 'service',
    },

    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'cover',
      label: 'Cover',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'images',
      label: 'Images',
      type: 'upload',
      relationTo: 'media',
      required: true,
      hasMany: true,
    },
    {
      name: 'offerings',
      label: 'Offerings',
      type: 'array',
      admin: {
        isSortable: true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'examples',
          label: 'Examples',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
