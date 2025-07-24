const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const constantConnect = await mongoose.connect(process.env.CONNECTION_URL);
    console.log(
      "Database connected:",
      constantConnect.connection.host,
      constantConnect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1); //if there is any error want to exit
  }
};

module.exports = connectDb;
