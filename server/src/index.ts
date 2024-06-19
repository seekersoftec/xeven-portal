import express from 'express';
import audit from 'express-requests-logger';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from '@/routes/route';
import { connectDB } from '@/database/database';
// const bodyParser = require("body-parser")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

// Middleware
// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(audit());

// Connect to MongoDB
connectDB(process.env.MONGO_URL as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('NOT CONNECTED TO NETWORK', err));

// Routes
app.use('/api/', Routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server started at port no. ${PORT}`);
});
