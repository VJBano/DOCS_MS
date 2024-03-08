
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: 'src/uploads',
    filename: (req, file, cb) => {
      
      const uniqueFileName = Date.now() + path.extname(file.originalname);
      cb(null, uniqueFileName);
    },
  });
  
  export const upload = multer({ storage: storage });

