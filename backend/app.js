import "./env.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";
import path from "node:path";
import {fileURLToPath} from "node:url";

import blogRouter from "./routes/blog.js";
import indexRouter from "./routes/index.js";

const app = express();
const __dirname = fileURLToPath(new URL(".", import.meta.url));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

let authStatus = false;

app.use("/", indexRouter);
app.use(
  "/blog",
  (req, res, next) => {
    if (!authStatus) {
      res.redirect("/auth");
    }
    next();
  },
  blogRouter
);

app.use("/auth", (req, res) => {
  res.redirect('https://github.com/login/oauth/author/ize?client_id=${process.env.CLIENT_ID}');
});

app.get("/callback", ({query: {code}}, res) => {
  const body = {client_id: process.env.CLIENT_ID,
  client_secret: SECRET,
  query};
  const options = {headers:{accept:'application/json'}};
  axios.post('https://github.com/login/oauth/access_token', body, options)
    .then((res) => res.data.access_token)
    .then((token) => {
      state = true;
      res.redirect("/blog");
    })
    .catch((err) => res.status(500).json({err: err.message}));
})

export default app;
