import formidable from 'formidable'
import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const form = formidable({ multiples: false })

  return await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, _fields, files) => {
      if (err) {
        reject(createError({ statusCode: 400, message: 'Failed to parse upload' }))
        return
      }

      if (!files.image || !files.image[0]) {
        reject(createError({ statusCode: 400, message: 'No image file uploaded' }))
        return
      }

      try {
        const file = files.image[0]
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
