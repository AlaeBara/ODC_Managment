const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/config.js');
const Auth = require('./Routes/auth.js')
const Formation = require('./Routes/Formation.js')
const Profile = require('./Routes/Profile.js')
const Evaluation = require('./Routes/Evaluation.js')
const Binificary = require('./Routes/Benificary.js')
const cookieParser = require('cookie-parser');
const workFlow = require('./Routes/WorkFlow.js');
const Presence = require('./Routes/Presence.js')
const Cloud = require('./Routes/Cloud.js')
const homeapi = require('./Routes/Homepageapi.js')
const admin = require('./Routes/Admin/Admin.js')
const formation = require('./Routes/Admin/Formation.js')
const mentorchanges = require('./Routes/Admin/Mentorchanges.js')

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
    credentials: true,
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
app.use('/api/admin',admin)
app.use('/api/admin/formation', formation)
app.use('/api/admin', mentorchanges)



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
