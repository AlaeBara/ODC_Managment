const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/config.js');
const Auth = require('./Routes/auth.js')
const {User} = require('./Models/userModel.js')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow credentials (cookies)
  })
);

// Connect to the database
connectDB();


app.use('/api/auth', Auth);


//insert line for test:
const insertTestUser = async () => {
  const password = '1234567';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
      username: 'testuser', 
      email: 'test@example.com',
      password: hashedPassword,
      role: 'Mentor', 
      assignedCourses: [],
  });

  try {
      await user.save();
      console.log('Test user inserted successfully');
  } catch (error) {
      console.error('Error inserting test user:', error);
  } finally {
      mongoose.connection.close();
  }
};

// insertTestUser();


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
