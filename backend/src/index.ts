import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { taskRouter } from './task.routes';
import { pool, ensureSchema } from './db'; // DB pool and schema bootstrap

const app = express();
const port = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*'}));
app.use(express.json());

// Routes
app.use('/api/tasks', taskRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
app.listen(port, async () => {
  try {
    // Ensure DB and tables exist, then test connection
    await ensureSchema();
    const connection = await pool.getConnection();
    console.log('Database connected successfully!');
    connection.release();
  } catch (err) {
    console.error('Failed to connect to database:', err);
  }
  console.log(`Backend server running at http://localhost:${port}`);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});