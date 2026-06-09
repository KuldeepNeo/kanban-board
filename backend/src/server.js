import app from './app.js';
import { getDatabaseConnection, closeDatabaseConnection } from './config/database.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Initialize Database and Migrations
    await getDatabaseConnection();
    console.log('Database initialized successfully.');

    const server = app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Graceful Shutdown Handler
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        try {
          await closeDatabaseConnection();
          console.log('Database connection closed.');
          process.exit(0);
        } catch (dbErr) {
          console.error('Error closing database connection:', dbErr);
          process.exit(1);
        }
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
