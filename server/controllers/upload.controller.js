const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Ensure upload directories exist
const ensureDirectoryExists = () => {
  const uploadDir = path.join(__dirname, '../uploads/products');
  if (!fs.existsSync(uploadDir)) {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`Created directory: ${uploadDir}`);
    } catch (error) {
      console.error(`Failed to create directory ${uploadDir}:`, error);
      throw new Error(`Failed to create upload directory: ${error.message}`);
    }
  }
  return uploadDir;
};

// Try to create upload directory on server start
try {
  const uploadDir = ensureDirectoryExists();
  console.log(`Upload directory verified: ${uploadDir}`);
} catch (error) {
  console.error('Error initializing upload directory:', error);
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadDir = ensureDirectoryExists();
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, GIF and WEBP files are allowed'), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
}).array('images', 5); // Allow up to 5 images

/**
 * Upload product images
 * @route POST /api/upload/product-images
 * @access Private - Farmer
 */
const uploadProductImages = (req, res, next) => {
  console.log('Processing product image upload');
  
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        console.error('Multer error:', err);
        return res.status(400).json({
          success: false,
          message: err.message
        });
      } else {
        // Unknown error
        console.error('Unknown upload error:', err);
        return res.status(500).json({
          success: false,
          message: err.message || 'An error occurred during file upload'
        });
      }
    }
    
    // No errors, process the upload
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }
    
    // Generate URLs for uploaded images
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.API_URL || `${req.protocol}://${req.get('host')}` 
        : `${req.protocol}://${req.get('host')}`;
        
      // Log the generated base URL for debugging
      console.log(`Using base URL for images: ${baseUrl}`);
      
      const imageUrls = req.files.map(file => {
        // Create a public URL for the file
        const relativePath = path.relative(
          path.join(__dirname, '../uploads'), 
          file.path
        ).replace(/\\/g, '/'); 
        
        const url = `${baseUrl}/uploads/${relativePath}`;
        console.log(`Generated image URL: ${url}`);
        return url;
      });
      
      console.log(`Successfully uploaded ${imageUrls.length} images`);
      
      res.status(200).json({
        success: true,
        message: 'Files uploaded successfully',
        imageUrls
      });
    } catch (error) {
      console.error('Error processing uploaded files:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing uploaded files'
      });
    }
  });
};

/**
 * Serve an image by proxy to avoid CORS issues
 * @route GET /api/upload/proxy/:type/:filename
 * @access Public
 */
const serveImageProxy = async (req, res) => {
  try {
    const { type, filename } = req.params;
    
    console.log(`Proxy image request for: ${type}/${filename}`);
    
    // Security check - prevent path traversal
    if (filename.includes('..') || type.includes('..')) {
      console.error(`Path traversal attempt detected for: ${type}/${filename}`);
      return res.status(400).json({ message: 'Invalid file path' });
    }
    
    // Determine the folder based on image type
    let folder = 'products';
    if (type === 'users') {
      folder = 'users';
    }
    
    // Build the file path
    const filePath = path.join(__dirname, '../uploads', folder, filename);
    console.log(`Looking for file at: ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      
      // Try alternative paths
      const alternativePaths = [
        path.join(__dirname, '../uploads', folder, filename),
        path.join(__dirname, '../..', 'uploads', folder, filename),
        path.join(__dirname, '../../uploads', folder, filename),
        path.join(process.cwd(), 'uploads', folder, filename),
        path.join(process.cwd(), 'server/uploads', folder, filename)
      ];
      
      console.log('Trying alternative paths:');
      let foundPath = null;
      
      for (const altPath of alternativePaths) {
        console.log(`- Checking ${altPath}`);
        if (fs.existsSync(altPath)) {
          console.log(`  -> Found file at ${altPath}`);
          foundPath = altPath;
          break;
        }
      }
      
      if (foundPath) {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Timing-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');
        res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
        
        console.log(`Serving image from alternative path: ${foundPath}`);
        return res.sendFile(foundPath);
      }
      
      // Add debug - list the directory contents
      try {
        const directoryPath = path.join(__dirname, '../uploads', folder);
        if (fs.existsSync(directoryPath)) {
          const files = fs.readdirSync(directoryPath);
          console.log(`Directory contents of ${directoryPath}:`, files);
        } else {
          console.error(`Directory does not exist: ${directoryPath}`);
          
          // Try to create the directory
          try {
            fs.mkdirSync(directoryPath, { recursive: true });
            console.log(`Created missing directory: ${directoryPath}`);
          } catch (mkdirError) {
            console.error(`Failed to create directory: ${mkdirError.message}`);
          }
        }
      } catch (dirError) {
        console.error('Error reading directory:', dirError);
      }
      
      return res.status(404).json({ 
        message: 'File not found',
        requestedFile: filename,
        searchedPath: filePath
      });
    }
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Timing-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    
    console.log(`Serving image: ${filePath}`);
    
    // Serve the file
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          return res.status(500).json({ message: 'Error serving image' });
        }
      }
    });
    
  } catch (error) {
    console.error('Error serving proxy image:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error serving image' });
    }
  }
};

module.exports = {
  uploadProductImages,
  serveImageProxy
}; 