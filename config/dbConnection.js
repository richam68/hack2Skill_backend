//mongoose is a object model design schema for our entities like contacts
//  or user it helps us to communicate with mongodb database
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    console.log("CONNECTION_URL", process.env.CONNECTION_URL);
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
