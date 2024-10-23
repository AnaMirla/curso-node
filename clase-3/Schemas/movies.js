const { z } = require("zod");

const movieSchema = z.object({
    title: z.string({
        required_error: "El título es requerido",
        invalid_type_error: "El título debe ser una cadena de texto",
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).optional().default(0),
    poster: z.string().url({
        message: "La URL del poster debe ser válida",
    }),
    genre: z.array(
        z.enum([
            "Action", "Adventure", "Comedy", "Drama", "Horror", "Thriller",
            "Western", "Sci-Fi", "Musical", "Animation", "Fantasy", "Film-Noir",
            "History", "Mystery", "Romance", "War"
        ], {
            message: "El género debe ser una lista de géneros válidos",
        })
    )
});

function validateMovie(object) {
    return movieSchema.safeParse(object);
};

function validatePartialMovie(input) {
    return movieSchema.partial().safeParse(input);
}

module.exports = { validateMovie, validatePartialMovie };
