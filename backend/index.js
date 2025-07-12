import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRouter from './routes/project.routes.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import taskRouter from './routes/task.route.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', //for development, change to your frontend URL in production
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server listening on port ${PORT}`);
});