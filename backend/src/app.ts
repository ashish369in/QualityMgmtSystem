import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import tasksRoutes from './routes/tasks';
import issuesRoutes from './routes/issues';
import usersRoutes from './routes/users';

const app = express();

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }

    const allowedDomains = [
      /^https?:\/\/localhost(:\d+)?$/,  // localhost with any port
      /^https:\/\/.*\.vercel\.app$/,    // any vercel app
      /^https:\/\/.*\.onrender\.com$/,  // any render app
    ];

    const isAllowed = allowedDomains.some(pattern => pattern.test(origin)) ||
                     origin === process.env.CORS_ORIGIN;

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400, // 24 hours in seconds
  optionsSuccessStatus: 200
};

// Apply CORS before any other middleware
app.use(cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/users', usersRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve frontend static files
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
