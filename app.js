const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const discoverRoutes = require("./routes/discoverRoutes");
const profileRoutes = require("./routes/profileRoutes");
const videoRoutes = require("./routes/videoRoutes");
const morgan = require('morgan')

app.use(express.json());
app.use(morgan('dev'))

app.use("/auth", authRoutes);
app.use("/users", profileRoutes);
app.use("/video", videoRoutes);
app.use("/discover", discoverRoutes);

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

module.exports = app;