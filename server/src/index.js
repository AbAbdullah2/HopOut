import express from "express";
//import eventUrls from "./routes/event.js";
import userUrls from "./routes/user.js";
//import api from "./routes/api.js"
import cors from "cors"
import helmet from "helmet"

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  console.log(`${req.method} ${req.path} called...`);
  res.send("Welcome to the HopOut API!");
});

//app.use(eventUrls);
app.use(userUrls);

app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    const code = err.status || 500;
    res.status(code).json({
      status: code,
      message: err.message || `Internal Server Error!`,
    });
  }
  next();
});

export default app;