import type { CollectionConfig } from 'payload'
import { isAdminOrCreator } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Operations',
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'mimeType', 'filesize', 'uploadedBy', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Allow public access for image delivery (e.g. frontend discovery)
      if (!user) return true

      // Admins see all uploaded media
      if ((user as any).role === 'ADMIN') return true

      // Creators only see and manage their own uploaded media
      if ((user as any).role === 'CREATOR') {
        return {
          uploadedBy: {
            equals: user.id,
          },
        }
      }

      return true
    },
    create: isAdminOrCreator,
    update: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).role === 'ADMIN') return true
      return {
        uploadedBy: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if ((user as any).role === 'ADMIN') return true
      return {
        uploadedBy: {
          equals: user.id,
        },
      }
    },
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (data && !data.alt) {
          data.alt = (req as any)?.file?.name || 'Media Asset'
        }
        return data
      },
    ],
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create' && req?.user) {
          data.uploadedBy = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      defaultValue: 'Media Asset',
      label: 'Alt Text / Description',
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Uploaded By (Creator)',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  upload: true,
}
