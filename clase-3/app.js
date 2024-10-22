const express = require("express");
const app = express();
app.use(express.json()); 
app.disable("x-powered-by");

const movies = require("./movies");
const crypto = require("crypto");
const { validateMovie } = require("./schemas/movies");


// Recuperar todas las películas y por género
app.get("/movies", (req, res) => {
    const { genre } = req.query;
    if (genre) {
        const filterMovies = movies.filter(
            (movie) => movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
        );
        return res.json(filterMovies);
    }
    res.json(movies);
});

// Recuperar todas las películas por id
app.get("/movies/:id", (req, res) => {
    const { id } = req.params;
    const movie = movies.find((movie) => movie.id === id);
    if (movie) return res.json(movie);
    res.status(404).json({ message: "Movie Not Found" });
});

// Crear una película
app.post("/movies", (req, res) => {
    const result = validateMovie(req.body);

    if (!result.success) {
        return res.status(400).json(result.error.issues);
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data,
    };

    movies.push(newMovie);
    res.status(201).json(newMovie);
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
