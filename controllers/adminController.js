import jwt from "jsonwebtoken";
import Movie from '../models/movie.model.js';
import mongoose from 'mongoose';

// Admin Login
export const SignIn = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Check if email and password provided
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Email and password required" 
            });
        }

        // Check if credentials match
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ 
                success: false,
                message: "Wrong email or password" 
            });
        }

        // Create token
        const token = jwt.sign(
            { role: "admin", email: email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "24h" }
        );

        res.status(200).json({ 
            success: true,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create a new movie
export const createMovie = async (req, res) => {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const genre = req.body.genre;
        const releaseDate = req.body.releaseDate;
        const duration = req.body.duration;
        const director = req.body.director;
        const cast = req.body.cast;

        let videoUrl = req.body.videoUrl;
        let posterImage = req.body.posterImage;
        let images = req.body.images || [];

        // Create movie object
        const newMovie = new Movie({
            title: title,
            description: description,
            genre: genre,
            releaseDate: releaseDate,
            duration: duration,
            director: director,
            cast: cast,
            videoUrl: videoUrl,
            posterImage: posterImage,
            images: images,
            createdBy: new mongoose.Types.ObjectId()
        });

        // Save to database
        await newMovie.save();

        res.status(201).json({
            success: true,
            message: "Movie created!",
            data: newMovie
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all movies (admin view)
export const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();

        res.status(200).json({
            success: true,
            total: movies.length,
            data: movies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a movie
export const updateMovie = async (req, res) => {
    try {
        const movieId = req.params.id;

        // Update movie in database
        const movie = await Movie.findByIdAndUpdate(
            movieId, 
            req.body,
            { new: true }
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Movie updated!",
            data: movie
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a movie
export const deleteMovie = async (req, res) => {
    try {
        const movieId = req.params.id;

        // Delete movie from database
        const movie = await Movie.findByIdAndDelete(movieId);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Movie deleted!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}