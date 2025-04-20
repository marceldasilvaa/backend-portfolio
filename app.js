require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT;

const app = express();

// config form data and json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// solve cors
app.use(
  cors({
    credentials: true,
    origin: "https://frontend-portfolio-black.vercel.app",
  })
);

// directory static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
const router = require("./rotes/Router");
app.use(router);

// connect with db
const db = require("./config/db");
app.use(db);

// run API
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
