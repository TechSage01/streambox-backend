# MovieVerse API - Testing Guide

## 1. Admin Sign In (Get Token)
```bash
POST http://localhost:5000/api/v1/admin/admin/signin
Content-Type: application/json

{
  "email": "admin@movieverse.com",
  "password": "admin123"
}
```

**Response:** You'll get a token - COPY THIS TOKEN for the next requests!

---

## 2. Admin - Create a Movie
```bash
POST http://localhost:5000/api/v1/admin/movies

Headers:
Authorization: Bearer <YOUR_TOKEN_HERE>
Content-Type: application/json

{
  "title": "Avatar",
  "description": "A paraplegic Marine dispatched to the moon Pandora",
  "genre": "[Sci-Fi", "Adventure"],
  "releaseDate": "2009-12-18",
  "duration": 162,
  "director": "James Cameron",
  "cast": ["Sam Worthington", "Zoe Saldana"],
  "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4",
  "posterImage": "https://via.placeholder.com/300x450?text=Avatar",
  "images": ["https://via.placeholder.com/500x300?text=Scene1"],
  "language": "English",
  "country": "USA",
  "budget": 237000000,
  "boxOffice": 2923000000
}
```

---

## 3. Admin - Get All Movies
```bash
GET http://localhost:5000/api/v1/admin/movies

Headers:
Authorization: Bearer <YOUR_TOKEN_HERE>
```

---

## 4. Admin - Update a Movie
```bash
PUT http://localhost:5000/api/v1/admin/movies/<MOVIE_ID>

Headers:
Authorization: Bearer <YOUR_TOKEN_HERE>
Content-Type: application/json

{
  "rating": 9.5,
  "title": "Avatar: The Way of Water"
}
```

---

## 5. Admin - Delete a Movie
```bash
DELETE http://localhost:5000/api/v1/admin/movies/<MOVIE_ID>

Headers:
Authorization: Bearer <YOUR_TOKEN_HERE>
```

---

## 6. Public - Get All Movies (No token needed!)
```bash
GET http://localhost:5000/api/v1/movies/all
```

---

## 7. Public - Search Movies
```bash
GET http://localhost:5000/api/v1/movies/search?query=Avatar
```

---

## 8. Public - Get Trending Movies
```bash
GET http://localhost:5000/api/v1/movies/trending
```

---

## 9. Public - Get Movies by Genre
```bash
GET http://localhost:5000/api/v1/movies/genre/Sci-Fi
```

---

## 10. Public - Get Single Movie
```bash
GET http://localhost:5000/api/v1/movies/<MOVIE_ID>
```
(This increases view count automatically)

---

## 11. Public - Rate a Movie
```bash
POST http://localhost:5000/api/v1/movies/<MOVIE_ID>/rate

Content-Type: application/json

{
  "rating": 8.5
}
```

---

## Summary
✅ **Admin Only:**
- POST /admin/movies - Create movie
- GET /admin/movies - View all movies
- PUT /admin/movies/:id - Update movie
- DELETE /admin/movies/:id - Delete movie

✅ **Public (No Auth Required):**
- GET /movies/all - Get all movies
- GET /movies/search - Search movies
- GET /movies/trending - Trending movies
- GET /movies/genre/:genre - Movies by genre
- GET /movies/:id - Get single movie
- POST /movies/:id/rate - Rate a movie
