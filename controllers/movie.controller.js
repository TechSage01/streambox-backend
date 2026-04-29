import Movie from '../models/movie.model.js';

const API_KEY = process.env.TMDB_API_KEY;

// Get all movies
export const getAllMovies = async (req, res) => {
    const { page } = req.params;

    if (!page) {
        return res.status(400).json({   
            success: false,
            message: "Page number is required"
        }); 
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({
                success: false,
                message: data.status_message || 'Failed to fetch movies'
            });
        }

        return res.status(200).json({
            success: true,  
            data: data.results || [],
            message: "Movies found",
            total_pages: data.total_pages || 1,
            page: data.page || 1
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get one movie by ID and type
export const getMovieById = async (req, res) => {
    const { type, id } = req.params;

    if (!type || !id) {
        return res.status(400).json({   
            success: false,
            message: "Resolve type and ID are required"
        }); 
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({
                success: false,
                message: data.status_message || 'Failed to fetch movies'
            });
        }        

        return res.status(200).json({
            success: true,  
            message: "Movie found",
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// for credit 
export const getMovieCredits = async (req, res) => {
    const { type, id } = req.params;
    if (!type || !id) {
        return res.status(400).json({   
            success: false,
            message: "Resolve type, ID and credits are required"
        }); 
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${API_KEY}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        if (!response.ok) {
            return res.status(500).json({
                success: false,
                message: data.status_message || 'Failed to fetch movies'
            });
        }
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
// for similar 
export const getSimilarMovies = async (req, res) => {
    const { type, id } = req.params;
    if (!type || !id) {
        return res.status(400).json({   
            success: false,
            message: "Resolve type, ID and similar movies are required"
        }); 
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${API_KEY}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        if (!response.ok) {
            return res.status(500).json({
                success: false,
                message: data.status_message || 'Failed to fetch similar movies'
            });
        }
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
// for videoRes 
export const getMovieVideos = async (req, res) => {
    const { type, id } = req.params;
    if (!type || !id) {
        return res.status(400).json({   
            success: false,
            message: "Resolve type, ID and videos are required"
        }); 
    }
    try {
        const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        if (!response.ok) {
            return res.status(500).json({
                success: false,
                message: data.status_message || 'Failed to fetch videos'
            });
        }
        return res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Search movies by name
export const searchMovies = async (req, res) => {
    try {

        const { query, category} = req.query;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }
        let endpoint = '';
        const base = "https://api.themoviedb.org/3";
        if (category) {
            switch (category) {
                case "nollywood":
                    endpoint = `${base}/search/movie?api_key=${API_KEY}&query=nollywood&include_adult=false`;
                    break;
                case "popular":
                    endpoint = `${base}/movie/popular?api_key=${API_KEY}&include_adult=false`;
                    break;
                case "teen-romance":
                    endpoint = `${base}/search/movie?api_key=${API_KEY}&query=teen%20romance&include_adult=false`;
                    break;
                case "k-drama":
                    endpoint = `${base}/search/tv?api_key=${API_KEY}&query=korean%20drama&include_adult=false`;
                    break;
                case "anime":
                    endpoint = `${base}/discover/tv?api_key=${API_KEY}&with_genres=16&sort_by=popularity.desc&include_adult=false`;
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: "Invalid category"
                    });
            }
        } else {
            endpoint = `${base}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`;
        }
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }

        });
        const data = await response.json();
        if (!response.ok) {
            return res.status(500).json({
                success: false,
                message: data.status_message || "Failed to fetch results"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Results found",
            data: data.results || []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get movies by TVShow
export const getTvShows = async (req, res) => {
  // FIX 1: default tab lowercased to match validTabs
  const { tab = "popular", page = 1 } = req.query;

  const validTabs = ["popular", "top_rated", "airing_today", "on_the_air"];

  if (!tab || !validTabs.includes(tab)) {
    return res.status(400).json({
      success: false,
      message: "Valid tab is required (popular, top_rated, airing_today, on_the_air)",
    });
  }

  // FIX 2: use safePage in the fetch URL, not the raw page
  const safePage = Math.min(Math.max(parseInt(page, 10) || 1, 1), 500);

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${tab}?api_key=${API_KEY}&page=${safePage}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.status_message || "Failed to fetch TV shows",
      });
    }

    return res.status(200).json({
      success: true,
      data: data.results || [],
      message: "TV shows found",
      total_pages: data.total_pages || 1,
      page: data.page || 1,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// search Tv shows 
export const searchTvShows = async (req, res) => {
  const { query, page = 1 } = req.query;
 
  if (!query || !query.trim()) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }
 
  const safePage = Math.min(Math.max(parseInt(page, 10) || 1, 1), 500);
 
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query.trim())}&page=${safePage}&include_adult=false`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
 
    const data = await response.json();
 
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.status_message || "Failed to search TV shows",
      });
    }
 
    return res.status(200).json({
      success: true,
      data: data.results || [],
      message: "TV shows search results",
      total_pages: data.total_pages || 1,
      page: data.page || 1,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// GET NOVELS MOVIE 
export const getMoviesByNovel = async (req, res) => {
    const {tab, page} = req.query;

    const safePage = Math.min(Math.max(parseInt(page, 10) || 1, 1), 500);
    const sort_by = tab === "top_rated" ? "vote_average.desc" : "popularity.desc";

    if (!tab || !["popular", "top_rated"].includes(tab)) {
        return res.status(400).json({
            success: false,
            message: "Valid tab is required (popular, top_rated)"
        });
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=18&sort_by=${sort_by}&page=${safePage || 1}`, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }

        }
    );
    const data = await response.json();
    if (!response.ok) {
        return res.status(response.status).json({
            success: false,
            message: data.status_message || "Failed to fetch movies"
        });
    }
    return res.status(200).json({
        success: true,
        data: data.results || [],
        message: "TV shows found",
        total_pages: data.total_pages || 1,
        page: data.page || 1,
    })
    
    }catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }

} 
// Get Animation movies 
export const getAnimationMovies = async (req, res) => {
    const {tab= 'popular', page = 1} = req.query;

        if (!["popular", "top_rated"].includes(tab)) {
        return res.status(400).json({
        success: false,
        message: "Valid tab is required (popular, top_rated)",
        });
    }

    const safePage = Math.min(Math.max(parseInt(page, 10) || 1, 1), 500);
    const sort_by = tab === "top_rated" ? "vote_average.desc" : "popularity.desc";
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=16&sort_by=${sort_by}&page=${safePage}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }

            }
        );
        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                message: data.status_message || "Failed to fetch anime"
            });
        }
        return res.status(200).json({
            success: true,
            data: data.results || [],   
            message: "Anime shows found",
            total_pages: data.total_pages || 1,
            page: data.page || 1,
        });

    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        });
    }
}

// Search anime movies 
export const searchAnimeMovies = async (req, res) => {
    const { query, page = 1 } = req.query;
    if (!query || !query.trim()) {
        return res.status(400).json({
            success: false,
            message: "Search query is required",
        });
    }
    const safePage = Math.min(Math.max(parseInt(page, 10) || 1, 1), 500);
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query.trim())}&page=${safePage}&include_adult=false&with_genres=16`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        );
        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                message: data.status_message || "Failed to search anime"
            });
        }
        return res.status(200).json({
            success: true,
            data: data.results || [],
            message: "Anime search results",
            total_pages: data.total_pages || 1,
            page: data.page || 1,
        });
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
        });
    }
}



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
  