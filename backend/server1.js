require('dotenv').config()
const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoutes = require('./routes/auth.js');
const adminRoutes = require("./routes/admin");
const user = require("./routes/user.js")
app.use(cors({
    origin: `http://localhost:5173`,
    credentials: true,
}));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use(authRoutes);
// app.use("/auth", authRoutes);
app.use(adminRoutes);
// app.use("/admin", adminRoutes);
// app.use("/users", user);
app.use(user);

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

app.listen(process.env.PORT1, () => {
    console.log(`http://localhost:${process.env.PORT1}`);
})