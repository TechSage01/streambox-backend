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

import { isSubscribed } from '../middleware/subscription.js';
import { verifyUserToken } from '../middleware/userAuth.js';
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
router.get('/:type/:id/credits', verifyUserToken, isSubscribed, getMovieCredits);
router.get('/:type/:id/similar', verifyUserToken, isSubscribed, getSimilarMovies);
router.get('/:type/:id/videos', verifyUserToken, isSubscribed, getMovieVideos);
router.get('/:type/:id', verifyUserToken, isSubscribed, getMovieById);
router.get('/:page', verifyUserToken, isSubscribed, getAllMovies);
router.post('/:id/rate', verifyUserToken, isSubscribed, rateMovie);


export default router;
