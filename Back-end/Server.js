const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/config.js');
const Auth = require('./Routes/auth.js')
const Formation = require('./Routes/Formation.js')
const Profile = require('./Routes/Profile.js')
const Evaluation = require('./Routes/Evaluation.js')
const Binificary = require('./Routes/Benificary.js')
const {User} = require('./Models/userModel.js')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const workFlow = require('./Routes/WorkFlow.js');
const Presence = require('./Routes/Presence.js')
const Cloud = require('./Routes/Cloud.js')
const homeapi = require('./Routes/Homepageapi.js')

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
app.use('/api/courses', Formation);
app.use('/api/profile', Profile);
app.use('/api/workFlow', workFlow);
app.use('/api/evaluation', Evaluation)
app.use('/api/binificary', Binificary)
app.use('/api/presence', Presence)
app.use('/api/cloud', Cloud)
app.use('/api/home', homeapi)

//insert line for test:
const insertTestUser = async () => {
  const password = '1234567';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
      email: 'test@test.com',
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

//insertTestUser();


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
