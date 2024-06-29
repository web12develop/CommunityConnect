const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, mobile } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !role || !mobile) {
      return res.status(400).json({
        status: 400,
        message: "Please fill all fields",
      });
    }

    // Validate role
    const validRoles = ["community member", "community business", "community organization"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid role",
      });
    }

    // Validate mobile number (basic check for digits only and length, adjust as needed)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid mobile number",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with hashed password and generated avatar image URL
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      mobile,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(name)}`,
    });

    // Generate JWT token
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    // Remove password from user object
    user.password = undefined;
  
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
    };

    // Set cookie and send response
    res.cookie('community_cookie', token, options).status(201).json({
      success: true,
      message: "User created successfully",
      token,
      data: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while creating the user",
    });
  }
};

exports.login = async (req, res) => {
  try {
    // Step 1: Data fetch
    const { email, password } = req.body;

    // Step 2: Validation on email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details carefully"
      });
    }

    // Step 3: Check for the registered user
    let user = await User.findOne({ email });

    // If not a registered user
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered"
      });
    }

    // Step 4: Verify password and generate a JWT token
    if (await bcrypt.compare(password, user.password)) { // To verify plain text password with hashed password

      // Password match
      const payload = {
        email: user.email,
        id: user._id,
        role: user.role
      };

      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '2h', // JWT token expiration time
      });

      // Remove password from user object
      user = user.toObject();
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        httpOnly: true // Additional flag included in a Set-Cookie HTTP response header
      };

      // Server sends cookie as res to the client
      res.cookie('CommunityConnect', token, options).status(200).json({
        success: true,
        token,
        user,
        message: 'User logged in successfully'
      });

    } else {
      // Password do not match
      return res.status(403).json({
        success: false,
        message: "Password incorrect"
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};
