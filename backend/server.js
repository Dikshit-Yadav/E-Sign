require('dotenv').config()
const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoutes = require('./routes/auth.js');
const adminRoutes = require("./routes/admin");
const documentsRoute = require("./routes/documents");
const user = require("./routes/user.js")
const officer = require("./routes/officer.js")

app.use(cors({ origin: 'http://localhost:5173', credentials: true,  }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());

app.use(authRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/", user);
app.use("/documents", documentsRoute);
app.use("/officer", officer);

app.get("/", (req, res) => {
    res.send("home page")
})
mongoose.connect(process.env.MongoDB_URl)
    .then(() => {
        console.log('MongoDB is Connected')
    })
    .catch((err) => {
        console.log("error", err)
    });

app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
})

