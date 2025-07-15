const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const uploadFolder = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');

module.exports = {
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename: (req, file, cb) => {
      const fileHash = crypto.randomBytes(8).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;
      return cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  },
};
