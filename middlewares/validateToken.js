const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// Middleware to validate JWT token
// This middleware checks if the request has a valid token in the Authorization header
//for making route protected and private we need to access token protection so anyone cannot access this route

const validateTokenHandler = asyncHandler(async (req, res, next) => {
  // Check if the request has an authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Extract the token from the authorization header
  if (authHeader || authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized, token failed");
      }
      // If the token is valid, attach the user information to the request object
      req.user = decoded.user;
      next(); // Call the next middleware or route handler
    });

    if (!token) {
      res.status(401);
      throw new Error("User is not authorized, no token provided/missing");
    }
  }
});

module.exports = validateTokenHandler;
