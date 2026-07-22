import formidable from 'formidable'
import fs from 'node:fs'
import path from 'node:path'
import { requireUser } from '../utils/auth.js'

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export default defineEventHandler(async (event) => {
  await requireUser(event)

  const form = formidable({
    multiples: false,
    maxFileSize: MAX_SIZE_BYTES
  })

  const parseUpload = () =>
    new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, _fields, files) => {
        if (err) {
          if (err.message?.includes('maxFileSize')) {
            reject(createError({ statusCode: 400, message: 'File too large. Max size is 5 MB.' }))
            return
          }
          reject(createError({ statusCode: 400, message: 'Failed to parse upload' }))
          return
        }

        if (!files.image || !files.image[0]) {
          reject(createError({ statusCode: 400, message: 'No image file uploaded' }))
          return
        }

        resolve(files.image[0])
      })
    })

  try {
    const file = await parseUpload()
    const mimetype = String(file.mimetype || '').toLowerCase()
    const ext = path.extname(file.originalFilename || '').toLowerCase()

    if (!ALLOWED_MIMETYPES.includes(mimetype)) {
      throw createError({ statusCode: 400, message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' })
    }

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw createError({ statusCode: 400, message: 'Invalid file extension. Only .jpg, .jpeg, .png, .webp, and .gif are allowed.' })
    }

    const oldPath = file.filepath
    const fileName = `${Date.now()}_${file.originalFilename || 'upload.jpg'}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const newPath = path.join(uploadDir, fileName)

    let processed = false
    try {
      const sharp = (await import('sharp')).default
      await sharp(oldPath)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toFile(newPath)
      fs.unlinkSync(oldPath)
      processed = true
    } catch {
      // sharp not available — fall back to raw copy
    }

    if (!processed) {
      fs.renameSync(oldPath, newPath)
    }

    return {
      filename: fileName,
      url: `/uploads/${fileName}`
    }
  } catch (uploadErr) {
    if (uploadErr.statusCode) throw uploadErr
    throw createError({ statusCode: 500, message: 'Upload failed', data: { error: uploadErr.message } })
  }
})
