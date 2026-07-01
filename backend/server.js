import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import UserRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 4000; 

// Connect to MongoDB
connectToMongoDB()

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use('/images', express.static('uploads')); 

// API Routes
app.use('/api/food', foodRouter);
app.use('/api/user', UserRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Root route
app.get('/', (req, res) => res.send('API is working'));

// Start server 
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
