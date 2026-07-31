const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { errorHandler, notFound } = require('./middleware/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const tutorialRoutes = require('./routes/tutorial.routes');
const quizRoutes = require('./routes/quiz.routes');
const bookmarkRoutes = require('./routes/bookmark.routes');
const progressRoutes = require('./routes/progress.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Security & Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting on auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many requests, please try again later' }
});
app.use('/api/v1/auth', authLimiter);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1/tutorials', tutorialRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/bookmarks', bookmarkRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/admin', adminRoutes);

// Root health check
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'TutorialsAdda API is running successfully' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
