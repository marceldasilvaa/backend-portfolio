const mongoose = require("mongoose");
const userDB = process.env.DB_USER;
const userPass = process.env.DB_PASS;

const conn = () => {
  try {
    const connectDB = mongoose.connect(
      `mongodb+srv://${userDB}:${userPass}@cluster.zjk23.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`
    );

    console.log("Conectou com o banco!");

    return connectDB;
  } catch (error) {
    console.log(error);
  }
};

conn();

module.exports = conn;
