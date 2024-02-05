const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

const upload = multer({ storage: storage }).single('image');

const transformImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  sharp(req.file.path)
    .resize({ width: 600, withoutEnlargement: true }) // Redimensionner à 600px de largeur, sans agrandir si l'image est plus petite
    .toFormat('webp') // Convertir en format WebP
    .toFile(req.file.path.replace(/\.[^.]+$/, '.webp'), (err, info) => {
      if (err) {
        console.error('Error transforming image:', err);
        return next(err);
      }

      req.file.filename = req.file.filename.replace(/\.[^.]+$/, '.webp');
      req.file.path = req.file.path.replace(/\.[^.]+$/, '.webp');
      req.file.size = info.size;

      console.log('Image transformed:', req.file);

      next();
    });
};

module.exports = { upload, transformImage };
