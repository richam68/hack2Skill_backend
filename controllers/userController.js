const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {
  isUserExists,
  createUser,
  comparePassword,
  findUserByEmail,
} = require("../services/userService");

//@desc Register a new user
//@route POST /api/users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if all fields are provided
  if (!email || !password || !username) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("All fields are mandatory");
  }

  //check if user already exists
  const userExists = await isUserExists(email);
  if (userExists) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("User already exists");
  }

  //create user
  const user = await createUser({
    username,
    email,
    password,
  });

  // if user is created successfully
  if (user) {
    res.status(StatusCodes.CREATED).json({
      _id: user.id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("User data is not valid");
  }
});

//@desc Login user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check if all fields are provided
  if (!email || !password) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("All fields are mandatory");
  }

  //find user by email
  const user = await findUserByEmail(email);

  //if user not found
  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("User not found");
  }

  //compare password

  if (user && (await comparePassword(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(StatusCodes.OK).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        accessToken,
      },
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error("Email or password is not valid");
  }
});

module.exports = { registerUser, loginUser };
