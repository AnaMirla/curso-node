const express = require("express");
const findFreePort = require('find-free-port');
const cors = require("cors");
const crypto = require("crypto");
const movies = require("./movies");
const { validateMovie, validatePartialMovie } = require("./schemas/movies");

const app = express();
app.use(express.json());
app.disable("x-powered-by");

// Configuración de CORS para aceptar peticiones de todos los orígenes
app.use(cors({
    origin: (origin, callback) => {
        // Lista blanca de orígenes permitidos
        const ACCEPTED_ORIGINS = [
            "http://localhost:1234",
            "http://localhost:3000",
            "http://localhost:8080"
        ];

        // Si el origen está en la lista blanca o no se provee (caso de solicitudes internas)
        if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// Endpoint para obtener películas
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

// Endpoint para obtener una película por ID
app.get("/movies/:id", (req, res) => {
    const { id } = req.params;
    const movie = movies.find((movie) => movie.id === id);
    if (movie) return res.json(movie);
    res.status(404).json({ message: "Movie Not Found" });
});

// Crear una nueva película
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

// Actualizar película por ID
app.patch("/movies/:id", (req, res) => {
    const result = validatePartialMovie(req.body);
    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const movieIndex = movies.findIndex((movie) => movie.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({ message: "Movie Not Found" });
    }

    const updatedMovie = {
        ...movies[movieIndex],
        ...result.data
    };
    movies[movieIndex] = updatedMovie;

    return res.json(updatedMovie);
});

// Eliminar una película por ID
app.delete("/movies/:id", (req, res) => {
    const { id } = req.params;
    const movieIndex = movies.findIndex((movie) => movie.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({ message: "Movie Not Found" });
    }

    movies.splice(movieIndex, 1);
    return res.json({ message: "Movie deleted successfully" });
});

// Opción CORS para preflight requests
app.options("/movies", (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.send(200);
});

// Encontrar un puerto libre y levantar el servidor
// findFreePort(3000, (err, freePort) => {
//     if (err) {
//         console.error("Error finding free port:", err);
//         return;
//     }

//     app.listen(freePort, () => {
//         console.log(`Server listening on port http://localhost:${freePort}/movies`);
//     });
// });

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log(`Server listening on port http:localhost:${PORT}/movies`)
});