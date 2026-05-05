import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Services: CollectionConfig = {
  slug: 'service',
  orderable: true,
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
      required: false,
      hasMany: true,
    },
    {
      name: 'relatedInners',
      type: 'join',
      collection: 'service-application', // The slug of the collection to join
      on: 'service', // The field name in service-inner that points here
      orderable: true,
      maxDepth: 2,
      admin: {
        defaultColumns: ['id', 'name'],
      },
    },
  ],
}
