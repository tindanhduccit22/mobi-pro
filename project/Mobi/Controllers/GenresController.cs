using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mobi.Data;
using Mobi.DTOs.Genres;
using Mobi.Models;

namespace Mobi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GenresController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Genres
        [HttpGet]
        public async Task<IActionResult> GetAllGenres()
        {
            var genres = await _context.Genres
                .Select(g => new GenreDTO
                {
                    GenreID = g.GenreId,
                    GenreName = g.GenreName
                })
                .ToListAsync();

            return Ok(genres);
        }

        // GET: api/Genres/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetGenreById(int id)
        {
            var genre = await _context.Genres
                .Where(g => g.GenreId == id)
                .Select(g => new GenreDTO
                {
                    GenreID = g.GenreId,
                    GenreName = g.GenreName
                })
                .FirstOrDefaultAsync();

            if (genre == null)
                return NotFound(new { message = "Genre not found." });

            return Ok(genre);
        }

        // POST: api/Genres
        [HttpPost]
        public async Task<IActionResult> CreateGenre([FromBody] CreateGenreDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var exists = await _context.Genres
                .AnyAsync(g => g.GenreName.ToLower() == dto.GenreName.Trim().ToLower());

            if (exists)
                return BadRequest(new { message = "Genre name already exists." });

            var genre = new Genre
            {
                GenreName = dto.GenreName.Trim()
            };

            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Genre created successfully.",
                genreID = genre.GenreId
            });
        }

        // PUT: api/Genres/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateGenre(int id, [FromBody] UpdateGenreDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var genre = await _context.Genres.FindAsync(id);
            if (genre == null)
                return NotFound(new { message = "Genre not found." });

            var duplicate = await _context.Genres
                .AnyAsync(g => g.GenreId != id &&
                               g.GenreName.ToLower() == dto.GenreName.Trim().ToLower());

            if (duplicate)
                return BadRequest(new { message = "Genre name already exists." });

            genre.GenreName = dto.GenreName.Trim();

            await _context.SaveChangesAsync();

            return Ok(new { message = "Genre updated successfully." });
        }

        // DELETE: api/Genres/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            var genre = await _context.Genres
                .Include(g => g.Movies)
                .FirstOrDefaultAsync(g => g.GenreId == id);

            if (genre == null)
                return NotFound(new { message = "Genre not found." });

            if (genre.Movies.Any())
                return BadRequest(new { message = "Cannot delete genre because it has related movies." });

            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Genre deleted successfully." });
        }
    }
}