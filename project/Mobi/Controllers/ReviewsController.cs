using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mobi.Data;
using Mobi.DTOs.Reviews;
using Mobi.Models;

namespace Mobi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Reviews
        [HttpGet]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Movie)
                .Select(r => new ReviewDTO
                {
                    ReviewID = r.ReviewId,
                    UserID = r.UserId,
                    UserName = r.User.FullName,
                    MovieID = r.MovieId,
                    MovieTitle = r.Movie.Title,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    ReviewDate = r.ReviewDate
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // GET: api/Reviews/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetReviewById(int id)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Movie)
                .Where(r => r.ReviewId == id)
                .Select(r => new ReviewDTO
                {
                    ReviewID = r.ReviewId,
                    UserID = r.UserId,
                    UserName = r.User.FullName,
                    MovieID = r.MovieId,
                    MovieTitle = r.Movie.Title,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    ReviewDate = r.ReviewDate
                })
                .FirstOrDefaultAsync();

            if (review == null)
                return NotFound(new { message = "Review not found." });

            return Ok(review);
        }

        // GET: api/Reviews/movie/3
        [HttpGet("movie/{movieId:int}")]
        public async Task<IActionResult> GetReviewsByMovie(int movieId)
        {
            var movieExists = await _context.Movies.AnyAsync(m => m.MovieId == movieId);
            if (!movieExists)
                return NotFound(new { message = "Movie not found." });

            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Movie)
                .Where(r => r.MovieId == movieId)
                .Select(r => new ReviewDTO
                {
                    ReviewID = r.ReviewId,
                    UserID = r.UserId,
                    UserName = r.User.FullName,
                    MovieID = r.MovieId,
                    MovieTitle = r.Movie.Title,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    ReviewDate = r.ReviewDate
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // GET: api/Reviews/user/2
        [HttpGet("user/{userId:int}")]
        public async Task<IActionResult> GetReviewsByUser(int userId)
        {
            var userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
            if (!userExists)
                return NotFound(new { message = "User not found." });

            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Movie)
                .Where(r => r.UserId == userId)
                .Select(r => new ReviewDTO
                {
                    ReviewID = r.ReviewId,
                    UserID = r.UserId,
                    UserName = r.User.FullName,
                    MovieID = r.MovieId,
                    MovieTitle = r.Movie.Title,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    ReviewDate = r.ReviewDate
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // POST: api/Reviews
        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userExists = await _context.Users.AnyAsync(u => u.UserId == dto.UserID);
            if (!userExists)
                return BadRequest(new { message = "User does not exist." });

            var movieExists = await _context.Movies.AnyAsync(m => m.MovieId == dto.MovieID);
            if (!movieExists)
                return BadRequest(new { message = "Movie does not exist." });

            var duplicate = await _context.Reviews.AnyAsync(r =>
                r.UserId == dto.UserID && r.MovieId == dto.MovieID);

            if (duplicate)
                return BadRequest(new { message = "User already reviewed this movie." });

            var review = new Review
            {
                UserId = dto.UserID,
                MovieId = dto.MovieID,
                Rating = dto.Rating,
                Comment = dto.Comment?.Trim(),
                ReviewDate = DateTime.Now
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Review created successfully.",
                reviewID = review.ReviewId
            });
        }

        // PUT: api/Reviews/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] UpdateReviewDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
                return NotFound(new { message = "Review not found." });

            review.Rating = dto.Rating;
            review.Comment = dto.Comment?.Trim();
            review.ReviewDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Review updated successfully." });
        }

        // DELETE: api/Reviews/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
                return NotFound(new { message = "Review not found." });

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Review deleted successfully." });
        }
    }
}