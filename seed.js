import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/movie.model.js';
import connectDB from './config/db.js';

dotenv.config();

// Sample movie data
const movies = [
    {
        title: "Inception",
        description: "A mind-bending thriller",
        genre: ["Sci-Fi", "Thriller"],
        releaseDate: new Date("2010-07-16"),
        duration: 148,
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio"],
        videoUrl: "https://example.com/video.mp4",
        posterImage: "https://example.com/poster.jpg",
        images: ["img1.jpg"]
    },
    {
        title: "The Dark Knight",
        description: "Batman fights the Joker",
        genre: ["Action", "Thriller"],
        releaseDate: new Date("2008-07-18"),
        duration: 152,
        director: "Christopher Nolan",
        cast: ["Christian Bale"],
        videoUrl: "https://example.com/video.mp4",
        posterImage: "https://example.com/poster.jpg",
        images: ["img1.jpg"]
    }
];

// Add movies to database
const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('Connected!');

        // Delete old movies
        await Movie.deleteMany({});
        console.log('Old movies deleted');

        // Add new movies
        await Movie.insertMany(movies);
        console.log('✅ Movies added!');

        process.exit(0);
    } catch (error) {
        console.log('❌ Error:', error.message);
        process.exit(1);
    }
};

seedDatabase();
