import type { CollectionConfig } from 'payload'
import { isAdmin, anyone } from '../access/roles'

const formatSlug = (val: string): string =>
  val
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', 'createdAt'],
    group: 'Taxonomy',
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && data.name && !data.slug) {
          data.slug = formatSlug(data.name)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Tag Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'URL Slug',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'ACTIVE',
      options: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Archived', value: 'ARCHIVED' },
      ],
      label: 'Status',
    },
  ],
}
