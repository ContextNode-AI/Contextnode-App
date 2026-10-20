import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user && (user as any).role === 'ADMIN')
}

export const isCreator: Access = ({ req: { user } }) => {
  return Boolean(user && (user as any).role === 'CREATOR')
}

export const isAdminOrCreator: Access = ({ req: { user } }) => {
  return Boolean(user && ((user as any).role === 'ADMIN' || (user as any).role === 'CREATOR'))
}

export const isAdminOrCreatorAdmin = ({ req }: { req: any }): boolean => {
  return Boolean(req?.user && (req.user.role === 'ADMIN' || req.user.role === 'CREATOR'))
}

export const isUser: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if ((user as any).role === 'ADMIN') return true
  return {
    id: {
      equals: user.id,
    },
  }
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return Boolean(user && (user as any).role === 'ADMIN')
}

export const anyone: Access = () => true

