require("dotenv").config();
const express = require("express");
const connectDb = require("./config/dbConnection");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const app = express();
connectDb();

//port for the server
//if PORT is not defined in .env file, it will default to 5000
const PORT = process.env.PORT || 5000;

//for handling post request we need json parser
app.use(express.json());

//for handling url encoded data
app.use(express.urlencoded({ extended: true }));

//route path
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

//starting server
app.listen(PORT, () => {
  console.log(`Server is listening, ${PORT}`);
});
