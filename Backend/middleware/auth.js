const jwt = require('jsonwebtoken');
require('dotenv').config();

// Check authenticity of the user
exports.auth = (req, res, next) => {
    try {
        // Extract JWT token
        const token = req.body.token || req.cookies.token || (req.header('Authorization') && req.header('Authorization').replace('Bearer', '').trim());
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token Missing',
            });
        }

        // Verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode; // Store the decoded token in request object
            next(); // Go to next middleware
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid',
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while verifying the token',
            error: error.message,
        });
    }
};

// Authorization middleware for community member
exports.isCommunityMember = (req, res, next) => {
    try {
        if (req.user.role !== 'community member') {
            return res.status(403).json({
                success: false,
                message: 'This is a protected route for community members only',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role is not matching',
            error: error.message,
        });
    }
};

// Authorization middleware for community business
exports.isCommunityBusiness = (req, res, next) => {
    try {
        if (req.user.role !== 'community business') {
            return res.status(403).json({
                success: false,
                message: 'This is a protected route for community businesses only',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role is not matching',
            error: error.message,
        });
    }
};

// Authorization middleware for community organization
exports.isCommunityOrganization = (req, res, next) => {
    try {
        if (req.user.role !== 'community organization') {
            return res.status(403).json({
                success: false,
                message: 'This is a protected route for community organizations only',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role is not matching',
            error: error.message,
        });
    }
};