import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf, isAdminFieldLevel, isAdminOrCreatorAdmin, anyone } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'status', 'plan', 'createdAt'],
    group: 'Operations',
    hidden: ({ user }) => (user as any)?.role !== 'ADMIN',
  },
  auth: true,
  access: {
    admin: isAdminOrCreatorAdmin,
    read: isAdminOrSelf,
    create: anyone,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ req, operation, data, context }) => {
        const currentUser = req?.user as any
        const isReqAdmin = currentUser && currentUser.role === 'ADMIN'

        // If internal seeder/admin context, allow
        if (context?.preventRoleSanitization || isReqAdmin) {
          return data
        }

        // On public registration or updates by non-admins, prevent privilege escalation
        if (operation === 'create') {
          if (data) {
            data.role = 'USER'
            data.status = 'ACTIVE'
            data.plan = 'FREE'
          }
        } else if (operation === 'update') {
          if (data) {
            delete data.role
            delete data.status
            delete data.plan
          }
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
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'USER',
      options: [
        { label: 'User', value: 'USER' },
        { label: 'Creator', value: 'CREATOR' },
        { label: 'Admin', value: 'ADMIN' },
      ],
      access: {
        update: isAdminFieldLevel,
      },
      admin: {
        description: 'Account permission role across the ContextNode platform.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'ACTIVE',
      options: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Suspended', value: 'SUSPENDED' },
        { label: 'Disabled', value: 'DISABLED' },
      ],
      access: {
        update: isAdminFieldLevel,
      },
      admin: {
        description: 'Operational status of the account.',
      },
    },
    {
      name: 'plan',
      type: 'select',
      defaultValue: 'FREE',
      options: [
        { label: 'Free', value: 'FREE' },
        { label: 'Paid', value: 'PAID' },
      ],
      access: {
        update: isAdminFieldLevel,
      },
      admin: {
        description: 'Customer subscription tier / access tier.',
      },
    },
    {
      name: 'avatar',
      type: 'text',
      label: 'Avatar URL',
      admin: {
        description: 'Profile image URL or initials identifier.',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio / Profile Description',
    },
  ],
}
