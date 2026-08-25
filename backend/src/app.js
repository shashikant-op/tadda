const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { randomUUID } = require('crypto');

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
const homeRoutes = require('./routes/home.routes');

const app = express();

// Security & Middlewares
app.use(helmet());
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://10.84.73.241:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
  req.id = req.get('x-request-id') || randomUUID();
  res.set('x-request-id', req.id);
  next();
});

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1/tutorials', tutorialRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/bookmarks', bookmarkRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/home', homeRoutes);

// Root health check
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'TutorialsAdda API is running successfully' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', requestId: req.id });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
