const express = require('express');
const dotenv = require('dotenv').config();

const router = require('./src/router');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'session',
  resave: false,
  saveUninitialized:true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_DB_URL,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native'
  })
}))

// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./passport')(passport);

// Serve all API routes externally
app.use('/api', router);

// Set mongoose to be available in Express routes
app.set('mongoose', mongoose);

// Parse request body as JSON
app.use(express.json({ limit: '200mb' }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./frontend/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'));
  });
}

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

async function main() {
  //const client = new MongoClient(process.env.MONGO_DB_URL);

  const PORT = process.env.PORT || 3000
  try {
    //await client.connect();
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    console.log('Starting server...');
    app.listen(process.env.PORT, () =>
      console.log(`Listening on port ${process.env.PORT}!`)
    );
  } catch (e) {
    console.error('Error connecting to DB: ', e);
  }
}

main()
