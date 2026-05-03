import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from './config/db.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.routes.js';
import movieRoutes from './routes/movie.routes.js';
import logger from './middleware/logger.js';
import subscriptionRoutes from "./routes/subscription.routes.js"


const app = express();
dotenv.config();
app.use(cors());

app.use(express.json());
app.use(logger);

//routes
app.get("/", (req, res) => res.json({ message: "Welcome to MovieVerse API" }));
app.use("/api/v1/admin", adminRoutes);
app.use('/user', userRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use("/api/v1/subscription", subscriptionRoutes);

const PORT = process.env.PORT;

const startApp = async () => {
    try {
       await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error)
    }
}

startApp();