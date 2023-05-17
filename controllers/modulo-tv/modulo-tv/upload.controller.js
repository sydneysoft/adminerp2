const ServiceSQL = require('../../../services/services');
const logger = require('../../../helpers/logger');
const { extname, resolve } = require('path')
const fs = require('fs')
const multer = require('multer')

const filename = (req, file, cb) => {
  // Middleware para guardar el archivo con un prefijo unico
  const uniqueSufix = `${Date.now()}${Math.round(Math.random() * 1E9)}`
  const ext = extname(file.originalname)
  file.uniqueSufix = uniqueSufix + ext
  cb(null, file.fieldname + '-' + uniqueSufix + ext)
}

// middleware para viddeos
const uploadVideo = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/videos/')
    },
    filename
  }),
  fileFilter(req, file, cb) {
    // Filtro para aceptar solamente videos mp4, MPEG-g o mkv
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/))
      return cb(new Error('Invalid video format'))
    cb(undefined, true)
  },
  limits: {
    fieldSize: 1 * 1E6 // 1 MB
  }
})

// middleware para imagenes
const uploadImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images')
    },
    filename
  }),
  fileFilter(req, file, cb) {
    // Filtro para aceptar solamente videos mp4, MPEG-g o mkv
    if (!file.originalname.match(/\.(jpg|webp|png|svg|gif)$/))
      return cb(new Error('Invalid video format'))
    cb(undefined, true)
  }
})


class UploadController {
  constructor() {
    this.thumbnail = new ServiceSQL('stream_thumbnails')
    this.video = new ServiceSQL('stream_videos')
  }

  uploadThumbnail = async (req, res) => { }

  uploadVideo = async (req, res) => {
    // name, size, ext, location, url
    try {
      const fileData = req.file
      const date = new Date()
      const data = {
        name: fileData.originalname,
        size: fileData.size,
        ext: extname(fileData.path),
        location: fileData.destination,
        url: fileData.path,
        created_at: date,
        updated_at: date
      }
      const result = await this.video.save(data)

      res.status(201).json({
        ok: true,
        msg: result[0]
      })
    } catch (error) {
      fs.unlinkSync(fileData.path)
      res.json({
        ok: false,
        msg: error.message
      })
    }
  }

  uploadThumbnail = async (req, res) => {
    try {
      const fileData = req.file
      const date = new Date()
      const data = {
        name: fileData.originalname,
        size: fileData.size,
        ext: extname(fileData.path),
        location: fileData.destination,
        url: fileData.path,
        created_at: date,
        updated_at: date
      }
      const result = await this.thumbnail.save(data)
      res.status(201).json({
        ok: true,
        msg: result[0]
      })
    } catch (error) {
      fs.unlinkSync(fileData.path)
      res.json({
        ok: false,
        msg: error.message
      })
    }
  }

  getVideo = async (req, res) => {
    const { id } = req.params
    const range = req.headers.range
    try {
      const data = (await this.video.getById(id))[0]
      const srcDir = data.url
      const videoSize = fs.statSync(srcDir).size
      const chunkSize = 1 * 1e+6 // 1 MB
      const start = range ? Number(range.replace(/\D/g, '')) : 0
      const end = Math.min(start + chunkSize, videoSize - 1)
      const contentLength = end - start + 1

      const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': `video/mp4`
      }

      res.writeHead(206, headers)
      const stream = fs.createReadStream(srcDir, { start, end })
      stream.pipe(res)
    } catch (error) {
      res.json({
        statusCode: 404,
        status: 'Error',
        msg: 'Video not found',
        message: error.message
      })
    }
  }

  getImage = async (req, res) => {
    const { id } = req.params

    try {
      const data = (await this.thumbnail.getById(id))[0]
      const headers = {
        // "Accept-Ranges": "bytes",
        "Content-Type": "image/webp",
        "Content-Length": data.size
      }
      res.writeHead(200, headers)
      return fs.createReadStream(resolve(data.url)).pipe(res)
      // logger.info(data)
      // res.sendFile(resolve(data.url))

    } catch (error) {
      res.json({
        statusCode: 404,
        status: 'Error',
        msg: 'Video not found',
        message: error.message
      })
    }

  }

}

module.exports = { UploadController, uploadImage, uploadVideo }




// app.post('/', upload.single('fileupload'), async (req, res) => {
//   //Your function code
//   console.log(req.body)
//   const fileData = req.file
//   console.log(fileData)
//   try {
//       // Insertar el uri por el que se va reconocer el video a la base de datos
//       const dataQuery = "INSERT INTO video_live SET url=?"

//       await con.query(
//           dataQuery,
//           fileData.uniqueSufix,
//           (error, results, fields) => {
//               if (error) {
//                   fs.unlinkSync(resolve(uploadDir, fileData.filename))
//                   res.json({
//                       status: 'Error',
//                       msg: "Error al guardar en la base de datos"
//                   })
//               }

//               res.json(results)
//           })
//   } catch (error) {
//       res.json({
//           status: 'Error',
//           statusCode: 500,
//           msg: 'Ocurrió un error interno intentalo nuevamente',
//           message: error.message
//       })
//   }
// })


// app.get('/video/:id.:ext', (req, res) => {
//   const { id, ext } = req.params
//   const range = req.headers.range
//   try {
//       const srcDir = resolve(uploadDir, `fileupload-${id}.${ext}`)
//       const videoSize = fs.statSync(srcDir).size
//       const chunkSize = 1 * 1e+6 // 1 MB
//       const start = range ? Number(range.replace(/\D/g, '')) : 0
//       const end = Math.min(start + chunkSize, videoSize - 1)
//       const contentLength = end - start + 1

//       const headers = {
//           'Content-Range': `bytes ${start}-${end}/${videoSize}`,
//           'Accept-Ranges': 'bytes',
//           'Content-Length': contentLength,
//           'Content-Type': `video/${ext}`
//       }

//       res.writeHead(206, headers)
//       const stream = fs.createReadStream(srcDir, { start, end })
//       stream.pipe(res)
//   } catch (error) {
//       res.json({
//           statusCode: 404,
//           status: 'Error',
//           msg: 'Video not found',
//           message: error.message
//       })
//   }

// })