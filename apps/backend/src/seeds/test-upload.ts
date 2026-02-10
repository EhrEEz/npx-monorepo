// apps/backend/src/test-s3-upload.ts
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenvConfig({ path: path.resolve(__dirname, '../../../../.env') })

const s3Client = new S3Client({
  region: process.env.PRIVATE_S3_REGION!,
  credentials: {
    accessKeyId: process.env.PRIVATE_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.PRIVATE_S3_SECRET_ACCESS_KEY!,
  },
})

async function testS3Upload() {
  console.log('🔍 Testing S3 Upload Configuration...')
  console.log('=====================================')
  console.log('Bucket:', process.env.PRIVATE_S3_BUCKET_NAME)
  console.log('Region:', process.env.PRIVATE_S3_REGION)
  console.log('Access Key:', process.env.PRIVATE_S3_ACCESS_KEY_ID?.substring(0, 10) + '...')
  console.log('=====================================\n')

  // Test 1: Upload a simple text file
  console.log('📝 Test 1: Uploading text file...')
  try {
    const textResult = await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.PRIVATE_S3_BUCKET_NAME!,
        Key: 'test/simple-text.txt',
        Body: Buffer.from('Hello from Nepaxis - S3 Test'),
        ContentType: 'text/plain',
        // NO ACL - important when ACLs are disabled
      }),
    )
    console.log('✅ Text upload successful!')
    console.log('   ETag:', textResult.ETag)
    console.log(
      `   URL: https://${process.env.PRIVATE_S3_BUCKET_NAME}.s3.${process.env.PRIVATE_S3_REGION}.amazonaws.com/test/simple-text.txt\n`,
    )
  } catch (error: any) {
    console.error('❌ Text upload failed!')
    console.error('   Error:', error.message)
    console.error('   Code:', error.Code || error.name)
    return
  }

  // Test 2: Create and upload a test image
  console.log('🖼️  Test 2: Creating and uploading test image...')
  try {
    // Create a simple 100x100 red PNG image
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
      'base64',
    )

    const imageResult = await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.PRIVATE_S3_BUCKET_NAME!,
        Key: 'test/test-image.png',
        Body: testImageBuffer,
        ContentType: 'image/png',
        // NO ACL
      }),
    )
    console.log('✅ Image upload successful!')
    console.log('   ETag:', imageResult.ETag)
    console.log(
      `   URL: https://${process.env.PRIVATE_S3_BUCKET_NAME}.s3.${process.env.PRIVATE_S3_REGION}.amazonaws.com/test/test-image.png\n`,
    )
  } catch (error: any) {
    console.error('❌ Image upload failed!')
    console.error('   Error:', error.message)
    console.error('   Code:', error.Code || error.name)
    return
  }

  // Test 3: Upload seed image if it exists
  console.log('📷 Test 3: Uploading seed-og.png if exists...')
  const seedImagePath = path.resolve(__dirname, './seed-og.png')

  if (fs.existsSync(seedImagePath)) {
    try {
      const fileBuffer = fs.readFileSync(seedImagePath)
      const seedResult = await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.PRIVATE_S3_BUCKET_NAME!,
          Key: './seed-og.png',
          Body: fileBuffer,
          ContentType: 'image/png',
          // NO ACL
        }),
      )
      console.log('✅ Seed image upload successful!')
      console.log('   ETag:', seedResult.ETag)
      console.log('   Size:', fileBuffer.length, 'bytes')
      console.log(
        `   URL: https://${process.env.PRIVATE_S3_BUCKET_NAME}.s3.${process.env.PRIVATE_S3_REGION}.amazonaws.com/test/seed-og.png\n`,
      )
    } catch (error: any) {
      console.error('❌ Seed image upload failed!')
      console.error('   Error:', error.message)
      console.error('   Code:', error.Code || error.name)
      return
    }
  } else {
    console.log('⚠️  seed-og.png not found, skipping...\n')
  }

  // Test 4: Verify uploaded files can be read
  console.log('🔍 Test 4: Verifying uploaded files...')
  try {
    const headResult = await s3Client.send(
      new HeadObjectCommand({
        Bucket: process.env.PRIVATE_S3_BUCKET_NAME!,
        Key: 'test/simple-text.txt',
      }),
    )
    console.log('✅ File verification successful!')
    console.log('   Content-Type:', headResult.ContentType)
    console.log('   Content-Length:', headResult.ContentLength)
    console.log('   Last-Modified:', headResult.LastModified)
  } catch (error: any) {
    console.error('❌ File verification failed!')
    console.error('   Error:', error.message)
    return
  }

  console.log('\n🎉 All S3 tests passed!')
  console.log('=====================================')
  console.log('✅ S3 configuration is working correctly')
  console.log('✅ You can now upload files through Payload CMS')
  console.log('=====================================')
}

// Run the test
testS3Upload().catch((error) => {
  console.error('💥 Unexpected error:', error)
  process.exit(1)
})
