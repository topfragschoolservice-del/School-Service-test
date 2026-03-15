require('dotenv').config();

process.env.JWT_SECRET = process.env.JWT_SECRET || 'school-transport-demo-secret';

const app = require('./app');
const connectDB = require('./config/db');
const seedDemoData = require('./utils/seedDemoData');

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedDemoData();
    app.listen(port, () => {
      console.log(`Backend server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
};

startServer();
