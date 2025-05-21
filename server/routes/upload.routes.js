const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { uploadProductImages, serveImageProxy } = require('../controllers/upload.controller');

// Base route: /api/upload

// Upload product images (allow farmers, staff, and admin)
router.post('/product-images', authenticate, authorize(['farmer', 'admin', 'staff']), uploadProductImages);

// Serve image via proxy (public)
router.get('/proxy/:type/:filename', serveImageProxy);

module.exports = router; 