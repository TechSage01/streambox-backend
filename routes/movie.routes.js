import express from 'express';
import {
    getAllMovies,
    getMovieById,
    searchMovies,
    getMoviesByGenre,
    getTrendingMovies,
    rateMovie
} from '../controllers/movie.controller.js';

const router = express.Router();

// Anyone can use these routes (no login required)
router.get('/all', getAllMovies);
router.get('/search', searchMovies);
router.get('/trending', getTrendingMovies);
router.get('/genre/:genre', getMoviesByGenre);
router.get('/:id', getMovieById);
router.post('/:id/rate', rateMovie);

export default router;
