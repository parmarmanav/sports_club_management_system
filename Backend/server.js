import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import membersRouter from './src/routes/v1/members.js';
import leadsRouter from './src/routes/v1/leads.js';
import sportsRouter from './src/routes/v1/sports.js';
import courtsRouter from './src/routes/v1/courts.js';
import slotsRouter from './src/routes/v1/slots.js';
import bookingsRouter from './src/routes/v1/bookings.js';
import shopRouter from './src/routes/v1/shop.js';
import barRouter from './src/routes/v1/bar.js';
import dashboardRouter from './src/routes/v1/dashboard.js';
import staffRouter from './src/routes/v1/staff.js';
import shiftsRouter from './src/routes/v1/shifts.js';
import leaveRouter from './src/routes/v1/leave.js';
import payrollRouter from './src/routes/v1/payroll.js';
import invoicesRouter from './src/routes/v1/invoices.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sports Club Management API',
      version: '1.0.0',
      description: 'API documentation for the Sports Club Management System backend',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/v1/*.js'], // Path to the API docs (looks for JSDoc comments in these files)
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running'
  });
});

// API Routes
app.use('/api/v1/members', membersRouter);
app.use('/api/v1/leads', leadsRouter);
app.use('/api/v1/sports', sportsRouter);
app.use('/api/v1/courts', courtsRouter);
app.use('/api/v1/slots', slotsRouter);
app.use('/api/v1/bookings', bookingsRouter);
app.use('/api/v1/shop', shopRouter);
app.use('/api/v1/bar', barRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/staff', staffRouter);
app.use('/api/v1/shifts', shiftsRouter);
app.use('/api/v1/leave', leaveRouter);
app.use('/api/v1/payroll', payrollRouter);
app.use('/api/v1/invoices', invoicesRouter);

// 404 Not Found handling
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
