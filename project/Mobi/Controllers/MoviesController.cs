using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mobi.Data;
using Mobi.DTOs.Movies;

namespace Mobi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MoviesController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/movies
        [HttpGet]
        public async Task<IActionResult> GetAllMovies()
        {
            var movies = await _context.Movies
                .Include(m => m.Genre)
                .Select(m => new MovieDTO
                {
                    MovieID = m.MovieId,
                    Title = m.Title,
                    Description = m.Description,
                    Duration = m.Duration,
                    ReleaseDate = m.ReleaseDate,
                    Language = m.Language,
                    Country = m.Country,
                    Director = m.Director,
                    Cast = m.Cast,
                    PosterURL = m.PosterUrl,
                    BannerURL = m.BannerUrl,
                    TrailerURL = m.TrailerUrl,
                    AgeRating = m.AgeRating,
                    Status = m.Status,
                    GenreName = m.Genre.GenreName
                })
                .ToListAsync();

            return Ok(movies);
        }

        // 2. GET: api/movies/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovieById(int id)
        {
            var movie = await _context.Movies
                .Include(m => m.Genre)
                .Where(m => m.MovieId == id)
                .Select(m => new MovieDetailDTO
                {
                    MovieID = m.MovieId,
                    Title = m.Title,
                    Description = m.Description,
                    Duration = m.Duration,
                    ReleaseDate = m.ReleaseDate,
                    Language = m.Language,
                    Country = m.Country,
                    Director = m.Director,
                    Cast = m.Cast,
                    PosterURL = m.PosterUrl,
                    BannerURL = m.BannerUrl,
                    TrailerURL = m.TrailerUrl,
                    AgeRating = m.AgeRating,
                    Status = m.Status,
                    GenreName = m.Genre.GenreName
                })
                .FirstOrDefaultAsync();

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found." });
            }

            return Ok(movie);
        }

        // 3. GET: api/movies/search?keyword=abc
        [HttpGet("search")]
        public async Task<IActionResult> SearchMovies([FromQuery] string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
            {
                return BadRequest(new { message = "Keyword is required." });
            }

            keyword = keyword.Trim().ToLower();

            var movies = await _context.Movies
                .Include(m => m.Genre)
                .Where(m => m.Title.ToLower().Contains(keyword))
                .Select(m => new MovieDTO
                {
                    MovieID = m.MovieId,
                    Title = m.Title,
                    Description = m.Description,
                    Duration = m.Duration,
                    ReleaseDate = m.ReleaseDate,
                    Language = m.Language,
                    Country = m.Country,
                    Director = m.Director,
                    Cast = m.Cast,
                    PosterURL = m.PosterUrl,
                    BannerURL = m.BannerUrl,
                    TrailerURL = m.TrailerUrl,
                    AgeRating = m.AgeRating,
                    Status = m.Status,
                    GenreName = m.Genre.GenreName
                })
                .ToListAsync();

            return Ok(movies);
        }

        // 4. GET: api/movies/genre/{genreId}
        [HttpGet("genre/{genreId}")]
        public async Task<IActionResult> GetMoviesByGenre(int genreId)
        {
            var genreExists = await _context.Genres.AnyAsync(g => g.GenreId == genreId);
            if (!genreExists)
            {
                return NotFound(new { message = "Genre not found." });
            }

            var movies = await _context.Movies
                .Include(m => m.Genre)
                .Where(m => m.GenreId == genreId)
                .Select(m => new MovieDTO
                {
                    MovieID = m.MovieId,
                    Title = m.Title,
                    Description = m.Description,
                    Duration = m.Duration,
                    ReleaseDate = m.ReleaseDate,
                    Language = m.Language,
                    Country = m.Country,
                    Director = m.Director,
                    Cast = m.Cast,
                    PosterURL = m.PosterUrl,
                    BannerURL = m.BannerUrl,
                    TrailerURL = m.TrailerUrl,
                    AgeRating = m.AgeRating,
                    Status = m.Status,
                    GenreName = m.Genre.GenreName
                })
                .ToListAsync();

            return Ok(movies);
        }

        // 5. POST: api/movies
        [HttpPost]
        public async Task<IActionResult> CreateMovie([FromBody] CreateMovieDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var genreExists = await _context.Genres.AnyAsync(g => g.GenreId == dto.GenreID);
            if (!genreExists)
            {
                return BadRequest(new { message = "Genre does not exist." });
            }

            var movie = new Mobi.Models.Movie
            {
                GenreId = dto.GenreID,
                Title = dto.Title,
                Description = dto.Description,
                Duration = dto.Duration,
                ReleaseDate = dto.ReleaseDate.HasValue ? DateOnly.FromDateTime(dto.ReleaseDate.Value) : null,
                Language = dto.Language,
                Country = dto.Country,
                Director = dto.Director,
                Cast = dto.Cast,
                PosterUrl = dto.PosterURL,
                BannerUrl = dto.BannerURL,
                TrailerUrl = dto.TrailerURL,
                AgeRating = dto.AgeRating,
                Status = dto.Status ?? "Now Showing"
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Movie created successfully.", movieId = movie.MovieId });
        }

        // 6. PUT: api/movies/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMovie(int id, [FromBody] UpdateMovieDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var movie = await _context.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound(new { message = "Movie not found." });
            }

            var genreExists = await _context.Genres.AnyAsync(g => g.GenreId == dto.GenreID);
            if (!genreExists)
            {
                return BadRequest(new { message = "Genre does not exist." });
            }

            movie.GenreId = dto.GenreID;
            movie.Title = dto.Title;
            movie.Description = dto.Description;
            movie.Duration = dto.Duration;
            movie.ReleaseDate = dto.ReleaseDate.HasValue ? DateOnly.FromDateTime(dto.ReleaseDate.Value) : null;
            movie.Language = dto.Language;
            movie.Country = dto.Country;
            movie.Director = dto.Director;
            movie.Cast = dto.Cast;
            movie.PosterUrl = dto.PosterURL;
            movie.BannerUrl = dto.BannerURL;
            movie.TrailerUrl = dto.TrailerURL;
            movie.AgeRating = dto.AgeRating;
            movie.Status = dto.Status ?? "Now Showing";

            await _context.SaveChangesAsync();

            return Ok(new { message = "Movie updated successfully." });
        }

        // 7. DELETE: api/movies/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var movie = await _context.Movies
                .Include(m => m.Showtimes)
                .Include(m => m.Favorites)
                .Include(m => m.Reviews)
                .FirstOrDefaultAsync(m => m.MovieId == id);
            
            if (movie == null)
            {
                return NotFound(new { message = "Movie not found." });
            }

            if (movie.Showtimes.Any())
            {
                return BadRequest(new { message = "Cannot delete movie because it has related showtimes." });
            }

            _context.Favorites.RemoveRange(movie.Favorites);
            _context.Reviews.RemoveRange(movie.Reviews);
            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Movie deleted successfully." });
        }
    }
}