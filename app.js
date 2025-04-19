require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT;

const app = express();

// dont save cache
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// config form data and json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// solve cors
app.use((req, res, next) => {
  console.log("🔍 Método:", req.method);
  console.log("🔍 Origin:", req.headers.origin);
  console.log("🔍 Path:", req.path);

  const allowedOrigins = ["https://portfolio-cyan-sigma-53.vercel.app"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    console.log("🔁 Resposta OPTIONS enviada");
    return res.sendStatus(204);
  }

  next();
});

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
