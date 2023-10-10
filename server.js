const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const app = express();

const router = require("./backend/src/router");
const path = require("path");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


// Bodyparser middleware for routes to accept JSON
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json({ limit: "1000mb" }));

// MongoDB session store
app.use(
  session({
    secret: process.env.SECRET_KEY,
    name: "session",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB_URL,
      ttl: 14 * 24 * 60 * 60,
      autoRemove: "native",
      crypto: {
        secret: process.env.SECRET_CRYPTO_KEY,
      },
    }),
  })
);

// Use prometheus metrics middleware
app.use(require("api-express-exporter")());

// Parse request body as JSON
app.use(express.json({ limit: "200mb" }));

// Use cookies
app.use(cookieParser());

// Use cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Passport middleware
app.use(cookieParser(process.env.APP_SECRET));
app.use(passport.initialize());
app.use(passport.session());
require("./passport")(passport);

// Set up express router to serve all api routes (more on this below)
app.use("/api", router);

// Set mongoose to be available in Express routes
app.set("mongoose", mongoose);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}
// Connect to MongoDB and then start listening
console.log("----- [SERVER] -----");
const serverPort = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) =>
    app.listen(serverPort, () =>
      console.log(`[SERVER] Listening on port ${serverPort}!`)
    )
  )
  .catch((error) => console.log("[SERVER] Error connecting to DB: ", error));
