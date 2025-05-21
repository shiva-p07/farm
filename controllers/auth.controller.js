/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    console.log('Full registration request body:', JSON.stringify(req.body, null, 2));
    
    const { name, email, password, role, phone, address, farmDetails } = req.body;

    console.log('Register request received:', { name, email, role, phone });
    console.log('Address data:', address);
    console.log('Farm details data:', farmDetails);

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Registration failed: User already exists with email:', email);
      return next(new ErrorResponse('User already exists', 400));
    }

    // ... existing code ...
  } catch (error) {
    console.error('Registration error details:', error);
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      console.error('Validation error fields:', Object.keys(error.errors));
      console.error('Validation error messages:', messages);
      return next(new ErrorResponse(messages.join(', '), 400));
    }
    
    if (error.code === 11000) {
      console.error('Duplicate key error details:', error.keyValue);
      return next(new ErrorResponse('Email already exists', 400));
    }
    
    // Log detailed error information
    console.error('Unhandled registration error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login request received for email:', email);

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('Login failed: User not found with email:', email);
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // ... existing code ...
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
}; 