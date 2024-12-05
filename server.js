const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./database/connection');
const sessionData = require('./session');
const errorMiddleware = require('./middleware/errorMiddleware')

const app = express();

const authRoutes = require('./routes/auth_routes');
const userRoutes = require('./routes/user_routes');
const allocationRoutes = require('./routes/allocation_routes');
const saleRoutes = require('./routes/sales_routes');
const phoneRoutes = require('./routes/phone_routes');
const marketRoutes = require('./routes/market_routes');

app.use(cors({origin:process.env.CLIENT_URL ,credentials:true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(sessionData)

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/phones', phoneRoutes);
app.use('/api/markets', marketRoutes);

/* // Error handling middleware
app.use(errorMiddleware); */

const PORT = process.env.PORT || 5000

app.listen(PORT,  async () => {
    await connectDB()
    console.log('SERVER STARTED')
})

/* 
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const allocationRoutes = require('./routes/allocationRoutes');
const saleRoutes = require('./routes/saleRoutes');

const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/allocations', authMiddleware, allocationRoutes);
app.use('/api/sales', authMiddleware, saleRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 

*/