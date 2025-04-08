const { createClient } = require("@supabase/supabase-js");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
// const compression = require('compression');
const redis = require('redis'); // Import Redis

// CORS configuration
const corsOptions = {
  origin: "http://localhost:8100",
  optionsSuccessStatus: 200,
};

// Environment variables
dotenv.config();

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
if (supabase) {
  console.log("Supabase client has been created");
} else {
  console.log("Supabase client has not been created");
}

// Redis client initialization
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
});
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
redisClient.on("connect", () => {
  console.log("Redis client connected");
});

// Route imports
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var loginRouter = require("./routes/login");
var signupRouter = require("./routes/signup");
var productsRouter = require("./routes/products");
var storesRouter = require("./routes/stores");
var cartRouter = require("./routes/cart");

var app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Middleware
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(compression());

// Pass Redis client to routes
app.use("/", indexRouter);
app.use(usersRouter(redisClient));
app.use(loginRouter(redisClient));
app.use(signupRouter);
app.use(productsRouter);
app.use(storesRouter);
app.use(cartRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
