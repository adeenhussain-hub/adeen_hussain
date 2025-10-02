const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const discoverRoutes = require("./routes/discoverRoutes");
const profileRoutes = require("./routes/profileRoutes");
const storyRoutes = require("./routes/storyRoutes");
const videoRoutes = require("./routes/videoRoutes");
const morgan = require('morgan')
const cors = require('cors')

app.use(cors({
  origin: "*",   // allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // allow all common methods
  allowedHeaders: ["Content-Type", "Authorization"] // allow common headers
}));

app.use(express.json());
app.use(morgan('dev'))

app.use("/auth", authRoutes);
app.use("/users", profileRoutes);
app.use("/video", videoRoutes);
app.use("/discover", discoverRoutes);
app.use("/story", storyRoutes);


const http = require("http");
const server = http.createServer(app);
const { initSocket } = require("./realtime/socket");
initSocket(server);

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});


module.exports = app;