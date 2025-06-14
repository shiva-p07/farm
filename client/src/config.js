// API URL - change this to your production URL when deploying
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Cloudinary configuration for image uploads
export const CLOUDINARY_URL = process.env.REACT_APP_CLOUDINARY_URL || 'https://api.cloudinary.com/v1_1/your-cloud-name/upload';
export const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset';

// Razorpay configuration
export const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_OcWgTiP8fXd6B9';

// File upload sizes
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10; 