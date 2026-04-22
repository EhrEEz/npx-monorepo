import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
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
    slugField({
      name: 'slug',
      useAsSlug: 'name',
      required: true,
    }),

    {
      name: 'label',
      label: 'Label',
      type: 'text',
      maxLength: 200,
      required: true,
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
      name: 'service_item',
      label: {
        singular: 'Service Item',
        plural: 'Service Items',
      },
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },
  ],
}
