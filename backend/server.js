// require('dotenv').config()
const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const path = require("path");
const authMiddleware = require("./middlewares/authMiddleware.js");
const authRoutes = require('./routes/auth.js');
const adminRoutes = require("./routes/admin");
const documentsRoute = require("./routes/documents");
const user = require("./routes/user.js")
const officer = require("./routes/officer.js")

app.use(cors({ origin: 'https://e-sign-vl9f.onrender.com', credentials: true, }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());

app.use(authRoutes);
app.use("/auth", authRoutes);
app.use("/admin",authMiddleware, adminRoutes);
app.use("/", user);
app.use("/documents",authMiddleware, documentsRoute);
app.use("/officer",authMiddleware, officer);

app.get("/", authMiddleware, (req, res) => {
    res.send("home page")
})

mongoose.connect(process.env.MongoDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB is Connected')
    })
    .catch((err) => {
        console.log("error", err)
    });

app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
})
