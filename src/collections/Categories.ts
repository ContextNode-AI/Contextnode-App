import type { CollectionConfig } from 'payload'
import { isAdmin, anyone } from '../access/roles'

const formatSlug = (val: string): string =>
  val
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', 'parent', 'createdAt'],
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
      label: 'Category Name',
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
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon Identifier / SVG',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories' as any,
      hasMany: false,
      label: 'Parent Category',
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
