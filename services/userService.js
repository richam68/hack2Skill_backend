const bcrypt = require("bcrypt");
const USERMODEL = require("../models/userModel");

// Check if user already exists
const isUserExists = async (email) => {
  return await USERMODEL.findOne({ email });
};

// Create a new user
const createUser = async ({ username, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await USERMODEL.create({
    username,
    email,
    password: hashedPassword,
  });
};

// Find user by email
const findUserByEmail = async (email) => {
  return await USERMODEL.findOne({ email });
};

// Compare password
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  isUserExists,
  createUser,
  findUserByEmail,
  comparePassword,
};
