require("dotenv").config();
const express = require("express");
const httpProxy = require("http-proxy");

const app = express();
const proxy = httpProxy.createProxyServer();

const authService = process.env.SERVER1_URL;
const documentService = process.env.SERVER2_URL;
const officerService = process.env.SERVER3_URL;

// Server 1 auth / admin / users
app.use(["/auth", "/admin", "/users"], (req, res) => {
  proxy.web(req, res, { target: authService });
});

// server 2 documents
app.use("/documents", (req, res) => {
  proxy.web(req, res, { target: documentService });
});

// server 3 officers
app.use("/officers", (req, res) => {
  proxy.web(req, res, { target: officerService });
});

proxy.on("error", (err, req, res) => {
  console.error("Proxy Error:", err.message);
});

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});