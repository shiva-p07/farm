/**
 * OTP Service for generating and verifying OTPs
 */
const crypto = require('crypto');

/**
 * Generate a numeric OTP of specified length
 * @param {number} length - Length of OTP (default: 6)
 * @returns {string} - Generated OTP
 */
const generateOTP = (length = 6) => {
  // Generate secure random bytes
  const buffer = crypto.randomBytes(Math.ceil(length / 2));
  
  // Convert to decimal and ensure it has the correct length
  let otp = parseInt(buffer.toString('hex'), 16).toString();
  otp = otp.substring(0, length);
  
  // Pad with leading zeros if needed
  while (otp.length < length) {
    otp = '0' + otp;
  }
  
  return otp;
};

/**
 * Calculate OTP expiry time
 * @param {number} minutes - Minutes until OTP expires (default: 10)
 * @returns {Date} - Expiry timestamp
 */
const calculateOTPExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

/**
 * Check if OTP is expired
 * @param {Date} expiryTime - OTP expiry timestamp
 * @returns {boolean} - True if expired, false otherwise
 */
const isOTPExpired = (expiryTime) => {
  return new Date() > new Date(expiryTime);
};

/**
 * Verify provided OTP matches stored OTP
 * @param {string} providedOTP - OTP provided by user
 * @param {string} storedOTP - OTP stored in database
 * @param {Date} expiryTime - OTP expiry timestamp
 * @returns {Object} - Verification result {valid: boolean, reason: string}
 */
const verifyOTP = (providedOTP, storedOTP, expiryTime) => {
  console.log('Verifying OTP:', {
    providedOTP,
    storedOTP,
    expiryTime,
    currentTime: new Date()
  });
  
  if (!providedOTP || !storedOTP) {
    console.log('Missing OTP data. ProvidedOTP exists:', !!providedOTP, 'StoredOTP exists:', !!storedOTP);
    return { valid: false, reason: 'Invalid OTP' };
  }
  
  if (isOTPExpired(expiryTime)) {
    console.log('OTP expired. Expiry time:', expiryTime, 'Current time:', new Date());
    return { valid: false, reason: 'OTP has expired' };
  }
  
  if (providedOTP !== storedOTP) {
    console.log('OTP mismatch. Provided:', providedOTP, 'Stored:', storedOTP);
    return { valid: false, reason: 'Incorrect OTP' };
  }
  
  console.log('OTP verification successful');
  return { valid: true };
};

module.exports = {
  generateOTP,
  calculateOTPExpiry,
  isOTPExpired,
  verifyOTP
}; 