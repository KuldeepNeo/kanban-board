import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
import ticketRouter from './routes/ticket.routes.js';
import { errorMiddleware, AppError } from './middleware/error.middleware.js';

dotenv.config();

const app = express();

// Security Headers hardening
app.use(helmet());

// CORS configuration
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin
}));

// Body parser
app.use(express.json());

// Routes configuration
app.use('/', authRouter);
app.use('/tickets', ticketRouter);

// Undefined Route Handler
app.use((req, res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.path}`, 404));
});

// Centralized error middleware
app.use(errorMiddleware);

export default app;
