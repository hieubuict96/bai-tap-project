import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.resolve(), 'public', 'images'));
  },
  filename: function (req, file, cb) {
    const fileNameList = file.originalname.split('.');
    let name = '';
    for (let i = 0; i < fileNameList.length; i++) {
      if (i != fileNameList.length - 1) {
        name += fileNameList[i];
      }
    }
    cb(null, name + '-' + Date.now() + '.' + fileNameList[fileNameList.length - 1])
  }
});

export const upload = multer({ storage: storage });
