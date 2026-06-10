import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const form = formidable({ multiples: false })

  return await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err)

      const file = files.image[0]
      const oldPath = file.filepath
      const fileName = Date.now() + '_' + file.originalFilename
      const newPath = path.join(process.cwd(), 'public/uploads', fileName)

      fs.renameSync(oldPath, newPath)

      resolve({
        filename: fileName
      })
    })
  })
})