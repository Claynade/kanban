import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRouter from './routes/project.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use('/api/project', projectRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});