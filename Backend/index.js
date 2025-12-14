// src/index.js (ESM)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Routes
import authRoutes from './routes/authRoutes.js';
import medicalRoutes from './routes/medicalRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('✅ API is running');
});


app.use('/api/auth', authRoutes);
app.use('/api/medical', medicalRoutes);


app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   POST /api/auth/signup`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/auth/getme`);
  console.log(`   POST /api/medical/analyze/text`);
  console.log(`   POST /api/medical/analyze/pdf`);
});

