const express = require("express");
const path = require("node:path");

const app = express();
require("dotenv").config();

const http = require("http");
const db = require("./db/queries");
const { neon } = require("@neondatabase/serverless");
const assetsPath = path.join(__dirname, "public");
const PORT = process.env.PORT || 3000;

const cors = require("cors");

app.use(cors());

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const postRouter = require("./routes/postRouter");
// const dashboardRouter = require("./routes/dashboardRouter");

// const newUserController = require("./controllers/newUserController");

const puzzleRouter = require("./routes/puzzleRouter");
app.use("/puzzle", puzzleRouter);

app.use(express.static(path.join(__dirname, "public")));

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true, // optional, if you send cookies
//   })
// );

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

// app.use("/dashboard", dashboardRouter);

// app.use("/posts", postRouter);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
