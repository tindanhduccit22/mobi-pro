using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mobi.Data;
using Mobi.DTOs.Favorites;
using Mobi.Models;

namespace Mobi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FavoritesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Favorites
        [HttpGet]
        public async Task<IActionResult> GetAllFavorites()
        {
            var favorites = await _context.Favorites
                .Include(f => f.User)
                .Include(f => f.Movie)
                    .ThenInclude(m => m.Genre)
                .Select(f => new FavoriteDTO
                {
                    FavoriteID = f.FavoriteId,

                    UserID = f.UserId,

                    UserName = f.User.FullName,


                    MovieID = f.MovieId,

                    MovieTitle = f.Movie.Title,

                    PosterUrl = f.Movie.PosterUrl,

                    GenreName = f.Movie.Genre.GenreName,

                    Duration = f.Movie.Duration,


                    CreatedAt = f.CreatedAt
                })
                .ToListAsync();


            return Ok(favorites);
        }

        // GET: api/Favorites/user/2
        [HttpGet("user/{userId:int}")]
        public async Task<IActionResult> GetFavoritesByUser(int userId)
        {

            var userExists =
                await _context.Users.AnyAsync(
                    u => u.UserId == userId
                );


            if (!userExists)
                return NotFound(
                    new { message = "User not found." }
                );



            var favorites = await _context.Favorites

                .Include(f => f.User)

                .Include(f => f.Movie)
                    .ThenInclude(m => m.Genre)


                .Where(f => f.UserId == userId)


                .Select(f => new FavoriteDTO
                {

                    FavoriteID = f.FavoriteId,


                    UserID = f.UserId,


                    UserName = f.User.FullName,



                    MovieID = f.MovieId,


                    MovieTitle = f.Movie.Title,


                    PosterUrl = f.Movie.PosterUrl,


                    GenreName = f.Movie.Genre.GenreName,


                    Duration = f.Movie.Duration,



                    CreatedAt = f.CreatedAt

                })


                .ToListAsync();



            return Ok(favorites);

        }

        // POST: api/Favorites
        [HttpPost]
        public async Task<IActionResult> CreateFavorite([FromBody] CreateFavoriteDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userExists = await _context.Users.AnyAsync(u => u.UserId == dto.UserID);
            if (!userExists)
                return BadRequest(new { message = "User does not exist." });

            var movieExists = await _context.Movies.AnyAsync(m => m.MovieId == dto.MovieID);
            if (!movieExists)
                return BadRequest(new { message = "Movie does not exist." });

            var duplicate = await _context.Favorites.AnyAsync(f =>
                f.UserId == dto.UserID && f.MovieId == dto.MovieID);

            if (duplicate)
                return BadRequest(new { message = "Movie already exists in favorites." });

            var favorite = new Favorite
            {
                UserId = dto.UserID,
                MovieId = dto.MovieID,
                CreatedAt = DateTime.Now
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Favorite added successfully.",
                favoriteID = favorite.FavoriteId
            });
        }

        // DELETE: api/Favorites/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteFavorite(int id)
        {
            var favorite = await _context.Favorites.FindAsync(id);
            if (favorite == null)
                return NotFound(new { message = "Favorite not found." });

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Favorite deleted successfully." });
        }

        // DELETE: api/Favorites/user/{userId}/movie/{movieId}
        [HttpDelete("user/{userId:int}/movie/{movieId:int}")]
        public async Task<IActionResult> DeleteFavoriteByUserAndMovie(int userId, int movieId)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.MovieId == movieId);

            if (favorite == null)
                return NotFound(new { message = "Favorite not found." });

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Favorite deleted successfully." });
        }
    }
}