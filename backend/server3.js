require('dotenv').config()
const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const path = require("path");
const officer = require("./routes/officer.js")
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true, }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());

app.use(officer);
app.use("/officer", officer);

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


app.listen(process.env.PORT3, () => {
    console.log(`http://localhost:${process.env.PORT3}`);
})