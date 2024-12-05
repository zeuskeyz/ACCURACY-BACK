const session = require('express-session')
const session_store = require('connect-mongodb-session')(session);

// Session configuration
const storage = new session_store(
  {
    uri: process.env.DB_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24,
  }
)

const sessionData = session({
  key: 'splash',
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: storage,
  cookie: {
    maxAge: 1000 * 60 * 60 * 100,
  }
})

module.exports = sessionData;



