import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// @desc    Upload local image file as Base64
// @route   POST /api/upload
// @access  Public
router.post('/', async (req, res) => {
  const { base64Data, fileName } = req.body;

  if (!base64Data || !fileName) {
    return res.status(400).json({ message: 'No file data or filename provided' });
  }

  try {
    // Ensure uploads directory exists in backend server root
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Strip metadata base64 header if present (e.g. data:image/png;base64,)
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Image, 'base64');

    // Create unique file name to avoid collisions
    const ext = path.extname(fileName) || '.png';
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Save buffer
    fs.writeFileSync(filePath, buffer);

    // Return the relative URL path of the static file
    const fileUrl = `/uploads/${uniqueFileName}`;
    res.json({ fileUrl });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Failed to upload file locally' });
  }
});

export default router;
