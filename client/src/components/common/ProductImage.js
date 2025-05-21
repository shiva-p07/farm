import React, { useState, useEffect } from 'react';
import { DEFAULT_RICE_PRODUCT_IMAGE } from '../../utils/imageUtils';
import api from '../../services/api';

/**
 * Convert a direct upload URL to a proxy URL to avoid CORS issues
 * @param {string} url - Original image URL
 * @returns {string} - Proxy URL
 */
const getProxyImageUrl = (url) => {
  if (!url) return null;
  
  console.log('Processing image URL:', url);
  
  // If it's already a proxy URL or a public asset, return as is
  if (url.includes('/api/upload/proxy/') || url.startsWith('/assets/') || url.startsWith('/images/')) {
    return url;
  }
  
  // Fix localhost URLs - replace port 3000 with 3001 for direct server access
  if (url.includes('localhost:3000')) {
    url = url.replace('localhost:3000', 'localhost:3001');
    console.log('Fixed localhost URL:', url);
  }
  
  // Extract filename for any URL pattern (server uploads)
  let filename = '';
  
  // Handle uploads URLs - extract product filename
  if (url.includes('/uploads/products/')) {
    try {
      const urlParts = url.split('/uploads/products/');
      if (urlParts.length > 1) {
        filename = urlParts[1];
        // Always use server port (3001) in development
        const fixedUrl = `http://localhost:3001/uploads/products/${filename}`;
        console.log('Converted to direct server URL:', fixedUrl);
        return fixedUrl;
      }
    } catch (error) {
      console.error('Error extracting filename from uploads URL:', error);
    }
  }
  
  // Handle full URL patterns (including hostname)
  if (url.startsWith('http')) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      filename = pathParts[pathParts.length - 1];
      
      // Check if this is a product image by its filename pattern
      if (filename.startsWith('product-')) {
        // Use direct server URL (port 3001) for product images
        const fixedUrl = `http://localhost:3001/uploads/products/${filename}`;
        console.log('Converted full URL to direct server URL:', fixedUrl);
        return fixedUrl;
      }
    } catch (error) {
      console.error('Error parsing URL for direct access:', error);
    }
  }
  
  // As a last resort, try the API proxy
  if (filename && filename.startsWith('product-')) {
    const proxyUrl = `/api/upload/proxy/products/${filename}`;
    console.log('Using API proxy URL:', proxyUrl);
    return proxyUrl;
  }
  
  // Return original URL as fallback
  console.log('Using original URL as fallback');
  return url;
};

/**
 * Fetch an image directly using API service to avoid CORS issues
 * @param {string} url - Original image URL 
 * @returns {Promise<string>} - Data URL for the image
 */
const fetchImageWithApi = async (url) => {
  try {
    // Only attempt for specific URL patterns
    if (!url) return null;
    
    console.log('Attempting to fetch image with API service:', url);
    
    // Extract filename from URL
    let filename = '';
    let type = 'products';
    
    if (url.includes('/uploads/products/')) {
      const parts = url.split('/uploads/products/');
      filename = parts[parts.length - 1];
    } else if (url.startsWith('http')) {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      filename = pathParts[pathParts.length - 1];
    }
    
    if (!filename.startsWith('product-')) {
      return null;
    }
    
    // Try direct access to server static files (without API)
    const directUrl = `/uploads/products/${filename}`;
    
    // Create a fetch request to check if direct access works
    try {
      const directResponse = await fetch(directUrl);
      if (directResponse.ok) {
        const blob = await directResponse.blob();
        return URL.createObjectURL(blob);
      }
    } catch (directError) {
      console.warn('Direct fetch failed, trying API proxy:', directError);
    }
    
    // If direct access fails, try the API proxy
    const apiResponse = await api.get(`/upload/proxy/${type}/${filename}`, {
      responseType: 'blob',
    });
    
    // Create a blob URL from the response
    const blob = new Blob([apiResponse.data], { type: apiResponse.headers['content-type'] });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching image with API:', error);
    return null;
  }
};

/**
 * ProductImage component for displaying product images with fallback
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alternative text for the image
 * @param {string} props.className - CSS classes to apply to the image
 * @param {Object} props.style - Optional inline styles
 * @returns {JSX.Element} - Image component with error handling
 */
const ProductImage = ({ src, alt, className = '', style = {} }) => {
  const [imgSrc, setImgSrc] = useState(() => {
    // Try to create proxy URL on initial load
    return getProxyImageUrl(src) || DEFAULT_RICE_PRODUCT_IMAGE;
  });
  const [loading, setLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Update image source when prop changes
    if (src) {
      setImgSrc(getProxyImageUrl(src));
      setLoading(true);
      setHasError(false);
      setRetryCount(0);
    } else {
      setImgSrc(DEFAULT_RICE_PRODUCT_IMAGE);
      setLoading(false);
    }
  }, [src]);

  // Effect for advanced retry with API fetch
  useEffect(() => {
    const tryAlternativeLoad = async () => {
      // Only try API fetch if we've had at least one error and not too many retries
      if (hasError && retryCount === 1) {
        try {
          const apiImageUrl = await fetchImageWithApi(src);
          if (apiImageUrl) {
            console.log('Successfully loaded image via API:', apiImageUrl);
            setImgSrc(apiImageUrl);
            setLoading(false);
            setHasError(false);
          }
        } catch (error) {
          console.error('Failed to load image via API fetch:', error);
        }
      }
    };
    
    tryAlternativeLoad();
  }, [hasError, retryCount, src]);

  const handleError = (e) => {
    console.log('Image loading error:', e.target.src);
    e.target.onerror = null; // Prevent infinite loop if fallback also fails
    
    // If not already using the default image and not too many retries
    if (retryCount < 2 && e.target.src !== DEFAULT_RICE_PRODUCT_IMAGE) {
      setHasError(true);
      setRetryCount(prev => prev + 1);
      
      // If this is the first error, try direct URL to uploads folder
      if (retryCount === 0) {
        // Extract filename from URL path
        let filename = '';
        try {
          if (src.includes('/uploads/products/')) {
            const parts = src.split('/uploads/products/');
            filename = parts[parts.length - 1];
          } else if (src.startsWith('http')) {
            const urlObj = new URL(src);
            const pathParts = urlObj.pathname.split('/');
            filename = pathParts[pathParts.length - 1];
          }
          
          if (filename && filename.startsWith('product-')) {
            const directUrl = `/uploads/products/${filename}`;
            console.log('Retrying with direct URL:', directUrl);
            setImgSrc(directUrl);
            return;
          }
        } catch (error) {
          console.error('Error creating direct URL:', error);
        }
      }
    } else {
      // Final fallback to default image
      console.log('Using default fallback image');
      setImgSrc(DEFAULT_RICE_PRODUCT_IMAGE);
      setLoading(false);
    }
  };

  const handleLoad = () => {
    console.log('Image loaded successfully:', imgSrc);
    setLoading(false);
    setHasError(false);
  };

  return (
    <img
      src={imgSrc}
      alt={alt || 'Product image'}
      className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      style={{
        ...style
      }}
      onError={handleError}
      onLoad={handleLoad}
      crossOrigin="anonymous"
    />
  );
};

export default ProductImage; 