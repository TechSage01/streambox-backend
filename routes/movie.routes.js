import express from 'express';
import {
    getAllMovies,
    getMovieById,
    searchMovies,
    // getMoviesByGenre,
    getTrendingMovies,
    rateMovie,
    getMovieCredits,
    getSimilarMovies,
    getMovieVideos,
    getTvShows,
    searchTvShows,
    getMoviesByNovel,
    getAnimationMovies,
    searchAnimeMovies
} from '../controllers/movie.controller.js';

const router = express.Router();

// Anyone can use these routes (no login required)
// Specific routes first (before parameterized routes)
router.get('/search', searchMovies);
router.get('/trending', getTrendingMovies);
router.get("/tv/shows", getTvShows);       // GET /api/v1/tv/shows?tab=popular&page=1
router.get("/tv/search", searchTvShows);   // GET /api/v1/tv/search?query=breaking+bad&page=1
router.get("/novels", getMoviesByNovel); // GET /api/v1/tv/novels?tab=popular&page=1
router.get("/anime", getAnimationMovies); // GET /api/v1/tv/anime?tab=popular&page=1
router.get("/anime/search", searchAnimeMovies); // GET /api/v1/tv/anime/search?query=one+piece&page=1

// Parameterized routes last (more generic)
// router.get('/genre/:genre', getMoviesByGenre);
router.get('/:type/:id/credits', getMovieCredits);
router.get('/:type/:id/similar', getSimilarMovies);
router.get('/:type/:id/videos', getMovieVideos);
router.get('/:type/:id', getMovieById);
router.get('/:page', getAllMovies);
router.post('/:id/rate', rateMovie);


export default router;
