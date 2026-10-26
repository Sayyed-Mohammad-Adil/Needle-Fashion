import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage with sanitized filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
  },
});

// File filter for security: only allow safe image MIME types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and SVG images are permitted.'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum
  },
  fileFilter,
});

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  upload.single('image'),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Return both relative URL and absolute filename
      const fileUrl = `/uploads/${req.file.filename}`;
      res.status(201).json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'File upload failed' });
    }
  }
);

// @desc    Upload multiple images (up to 10 at once)
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post(
  '/multiple',
  protect,
  admin,
  upload.array('images', 10),
  (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const uploadedFiles = files.map((file) => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      }));

      res.status(201).json({
        success: true,
        count: uploadedFiles.length,
        files: uploadedFiles,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Multiple file upload failed' });
    }
  }
);

// @desc    List all uploaded media files in gallery
// @route   GET /api/upload
// @access  Private/Admin
router.get('/', protect, admin, (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(uploadDir)) {
      return res.json({ files: [] });
    }

    const files = fs.readdirSync(uploadDir);
    const mediaFiles = files
      .filter((file) => !file.startsWith('.'))
      .map((filename) => {
        const filePath = path.join(uploadDir, filename);
        const stats = fs.statSync(filePath);
        return {
          filename,
          url: `/uploads/${filename}`,
          size: stats.size,
          createdAt: stats.birthtime,
          updatedAt: stats.mtime,
        };
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    res.json({ success: true, count: mediaFiles.length, files: mediaFiles });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete an uploaded image
// @route   DELETE /api/upload/:filename
// @access  Private/Admin
router.delete('/:filename', protect, admin, (req: Request, res: Response) => {
  try {
    const filename = path.basename(req.params.filename); // sanitize
    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true, message: 'File deleted successfully' });
    } else {
      return res.status(404).json({ message: 'File not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
