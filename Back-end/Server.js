// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './Config/config.js'; // Ensure the path matches the actual file structure

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to the database
connectDB();

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Add your routes here
// Example: app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
