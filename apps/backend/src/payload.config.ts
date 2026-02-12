import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { s3Storage } from '@payloadcms/storage-s3'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/BlogCategory'
import { Articles } from './collections/BlogArticle'
import { SEOPages } from './collections/Pages'
import { SiteSettings } from './global/SiteSetttings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Load .env from monorepo root
dotenvConfig({ path: path.resolve(dirname, '../../../.env') })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  ...(process.env.ENV_MODE === 'prod' && { cors: [process.env.PUBLIC_CLIENT_URL ?? ''] }),
  collections: [Users, Media, Categories, Articles, SEOPages],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PRIVATE_PAYLOAD_SECRET!,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.PRIVATE_WRITE_DATABASE_URI!,
      ssl: {
        rejectUnauthorized: false, // This bypasses the 'local issuer certificate' check
      },
    },
    readReplicas: [process.env.PRIVATE_DATABASE_URI!],
    push: process.env.ENV_MODE === 'dev' ? true : false,
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['articles', 'seo-pages'], // Add all collections here
      uploadsCollection: 'media',
      generateTitle: ({ doc, collectionConfig }) => {
        // Check which collection is being processed
        if (collectionConfig?.slug === 'articles') {
          return `${doc?.title || 'Untitled Article'} | Nepaxis`
        }
        if (collectionConfig?.slug === 'seo-pages') {
          return `${doc?.page_title || 'Untitled Page'}`
        }
        return 'Nepaxis'
      },
      generateDescription: ({ doc, collectionConfig }) => {
        if (collectionConfig?.slug === 'articles') {
          return doc?.short_quote || ''
        }
        if (collectionConfig?.slug === 'seo-pages') {
          return doc?.page_description || ''
        }
        return ''
      },
      generateImage: ({ doc, collectionConfig }) => {
        if (collectionConfig?.slug === 'articles') {
          return doc?.cover_image || null
        }
        if (collectionConfig?.slug === 'seo-pages') {
          return doc?.og_image || null
        }
        return null
      },
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'keywords',
          type: 'text',
          label: 'Keywords',
        },
        {
          name: 'prevent_indexing',
          label: 'Prevent Indexing',
          type: 'checkbox',
          defaultValue: false,
          required: true,
          admin: {
            position: 'sidebar',
          },
        },
      ],
    }),
    ...(process.env.PRIVATE_DELPLOYMENT_STORAGE === 'vercel'
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: {
              media: true,
            },
            token: process.env.PRIVATE_BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : process.env.PRIVATE_DELPLOYMENT_STORAGE === 's3'
        ? [
            s3Storage({
              collections: {
                media: {
                  disableLocalStorage: true,
                },
              },
              bucket: process.env.PRIVATE_S3_BUCKET_NAME!,
              config: {
                credentials: {
                  accessKeyId: process.env.PRIVATE_S3_ACCESS_KEY_ID!,
                  secretAccessKey: process.env.PRIVATE_S3_SECRET_ACCESS_KEY!,
                },
                region: process.env.PRIVATE_S3_REGION!,
                forcePathStyle: false,
                // ... Other S3 configuration
              },
            }),
          ]
        : []),
  ],
})
