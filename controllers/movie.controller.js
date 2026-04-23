import Movie from '../models/movie.model.js';

// Get all movies
export const getAllMovies = async (req, res) => {
    try {
        // Get movies from database
        const movies = await Movie.find({ isActive: true });

        res.status(200).json({
            success: true,
            data: movies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get one movie by ID
export const getMovieById = async (req, res) => {
    try {
        const movieId = req.params.id;

        // Find movie in database
        const movie = await Movie.findById(movieId);

        // If movie not found
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }

        // Add 1 view
        movie.views = movie.views + 1;
        await movie.save();

        res.status(200).json({
            success: true,
            data: movie
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Search movies by name
export const searchMovies = async (req, res) => {
    try {
        const searchQuery = req.query.query;

        // Find movies with matching title
        const movies = await Movie.find({
            isActive: true,
            title: { $regex: searchQuery, $options: "i" } // i = case insensitive
        });

        res.status(200).json({
            success: true,
            data: movies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get movies by genre
export const getMoviesByGenre = async (req, res) => {
    try {
        const genre = req.params.genre;

        // Find all movies with this genre
        const movies = await Movie.find({
            isActive: true,
            genre: genre
        });

        res.status(200).json({
            success: true,
            data: movies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get trending movies (most viewed)
export const getTrendingMovies = async (req, res) => {
    try {
        // Get movies sorted by views (highest first)
        const movies = await Movie.find({ isActive: true })
            .sort({ views: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: movies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Rate a movie
export const rateMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const newRating = req.body.rating;

        // Find and update movie rating
        const movie = await Movie.findByIdAndUpdate(
            movieId,
            { rating: newRating },
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
            data: movie
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
