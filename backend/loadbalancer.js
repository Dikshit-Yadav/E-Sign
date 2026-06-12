require("dotenv").config();
const express = require("express");
const httpProxy = require("http-proxy");

const app = express();
const proxy = httpProxy.createProxyServer();

const servers = [
  `http://localhost:${process.env.PORT1}`,
  `http://localhost:${process.env.PORT2}`,
  `http://localhost:${process.env.PORT3}`
];

let current = 0;

proxy.on("error", (err, req, res) => {
  console.error("Proxy Error:", err.message);

  res.writeHead(500, {
    "Content-Type": "text/plain"
  });

  res.end("Proxy error");
});

app.use((req, res) => {
  
  const target = servers[current];

  current = (current + 1) % servers.length;

  console.log(`Forwarding to ${target}`);

  proxy.web(req, res, {
    target
  });
});

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});