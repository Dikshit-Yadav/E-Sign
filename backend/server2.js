require('dotenv').config()
const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const path = require("path");
const documentsRoute = require("./routes/documents");
const { error } = require("console");
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true, }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());

app.use("/documents", documentsRoute);
app.use(documentsRoute);

app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
});
app.get("/", (req, res) => {
    res.send("home page");
})

mongoose.connect(process.env.MongoDB_URL)
    .then(() => console.log("MongoDB is Connected"))
    .catch(err => {
        console.log("error", err);
        process.exit(1);
    });
    

app.listen(process.env.PORT2, () => {
    console.log(`http://localhost:${process.env.PORT2}`);
})