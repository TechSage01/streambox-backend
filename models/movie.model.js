import mongoose from "mongoose";

// Create movie schema (structure of movie in database)
const movieSchema = mongoose.Schema({
    // Basic info
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    genre: [String], // Array of genres like ["Action", "Sci-Fi"]
    releaseDate: Date,
    duration: Number, // in minutes
    
    // People involved
    director: String,
    cast: [String], // Array of actor names
    
    // Media files
    videoUrl: String, // Link to video
    posterImage: String, // Link to poster image
    images: [String], // Array of other images
    
    // Other details
    language: {
        type: String,
        default: "English"
    },
    country: String,
    budget: Number,
    boxOffice: Number,
    rating: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    
    // Admin info
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create Movie model from schema
const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
