const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const personnelRoutes = require('./routes/personnelRoutes');
const dutyAssignmentRoutes = require('./routes/dutyAssignmentRoutes');
const leaveRequestRoutes = require('./routes/leaveRequestRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 },
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api/duty-assignments', dutyAssignmentRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
