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

  return await new Promise((resolve, reject) => {
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

      try {
        const file = files.image[0]
        const mimetype = String(file.mimetype || '').toLowerCase()
        const ext = path.extname(file.originalFilename || '').toLowerCase()

        if (!ALLOWED_MIMETYPES.includes(mimetype)) {
          reject(createError({ statusCode: 400, message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' }))
          return
        }

        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          reject(createError({ statusCode: 400, message: 'Invalid file extension. Only .jpg, .jpeg, .png, .webp, and .gif are allowed.' }))
          return
        }

        const oldPath = file.filepath
        const fileName = `${Date.now()}_${file.originalFilename || 'upload'}`
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }

        const newPath = path.join(uploadDir, fileName)
        fs.renameSync(oldPath, newPath)

        resolve({
          filename: fileName,
          url: `/uploads/${fileName}`
        })
      } catch (uploadErr) {
        reject(createError({ statusCode: 500, message: 'Upload failed', data: { error: uploadErr.message } }))
      }
    })
  })
})
