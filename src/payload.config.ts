import 'dotenv/config'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { AIAssets } from './collections/AIAssets'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — ContextNode Admin OS',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/contextnode-logo.png',
        },
      ],
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Icon#Icon',
      },
      Nav: '@/components/admin/SidebarNav#SidebarNav',
      beforeDashboard: ['@/components/admin/DashboardOverview#DashboardOverview'],
    },
  },
  collections: [Users, Media, Categories, Tags, AIAssets],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  cors: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:4000',
    'http://127.0.0.1:4000',
    'http://localhost:8088',
    'http://127.0.0.1:8088',
  ],
  csrf: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:4000',
    'http://127.0.0.1:4000',
    'http://localhost:8088',
    'http://127.0.0.1:8088',
  ],
  sharp,
  plugins: [],
})
