using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mobi.Data;
using Mobi.DTOs.Showtimes;
using Mobi.Models;

namespace Mobi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShowtimesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ShowtimesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Showtimes
        [HttpGet]
        public async Task<IActionResult> GetAllShowtimes()
        {
            var showtimes = await _context.Showtimes
                .Include(s => s.Movie)
                .Include(s => s.Room)
                    .ThenInclude(r => r.Cinema)
                .Select(s => new ShowtimeDTO
                {
                    ShowtimeID = s.ShowtimeId,
                    MovieID = s.MovieId,
                    MovieTitle = s.Movie.Title,
                    RoomID = s.RoomId,
                    RoomName = s.Room.RoomName,
                    CinemaName = s.Room.Cinema.CinemaName,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    Price = s.Price,
                    Format = s.Format,
                    AvailableSeats = s.AvailableSeats
                })
                .ToListAsync();

            return Ok(showtimes);
        }

        // GET: api/Showtimes/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetShowtimeById(int id)
        {
            var showtime = await _context.Showtimes
                .Include(s => s.Movie)
                .Include(s => s.Room)
                    .ThenInclude(r => r.Cinema)
                .Where(s => s.ShowtimeId == id)
                .Select(s => new ShowtimeDTO
                {
                    ShowtimeID = s.ShowtimeId,
                    MovieID = s.MovieId,
                    MovieTitle = s.Movie.Title,
                    RoomID = s.RoomId,
                    RoomName = s.Room.RoomName,
                    CinemaName = s.Room.Cinema.CinemaName,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    Price = s.Price,
                    Format = s.Format,
                    AvailableSeats = s.AvailableSeats
                })
                .FirstOrDefaultAsync();

            if (showtime == null)
                return NotFound(new { message = "Showtime not found." });

            return Ok(showtime);
        }

        // GET: api/Showtimes/movie/4
        [HttpGet("movie/{movieId:int}")]
        public async Task<IActionResult> GetShowtimesByMovie(int movieId)
        {
            var movieExists = await _context.Movies.AnyAsync(m => m.MovieId == movieId);
            if (!movieExists)
                return NotFound(new { message = "Movie not found." });

            var showtimes = await _context.Showtimes
                .Include(s => s.Movie)
                .Include(s => s.Room)
                    .ThenInclude(r => r.Cinema)
                .Where(s => s.MovieId == movieId)
                .Select(s => new ShowtimeDTO
                {
                    ShowtimeID = s.ShowtimeId,
                    MovieID = s.MovieId,
                    MovieTitle = s.Movie.Title,
                    RoomID = s.RoomId,
                    RoomName = s.Room.RoomName,
                    CinemaName = s.Room.Cinema.CinemaName,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    Price = s.Price,
                    Format = s.Format,
                    AvailableSeats = s.AvailableSeats
                })
                .ToListAsync();

            return Ok(showtimes);
        }

        // GET: api/Showtimes/cinema/2
        [HttpGet("cinema/{cinemaId:int}")]
        public async Task<IActionResult> GetShowtimesByCinema(int cinemaId)
        {
            var cinemaExists = await _context.Cinemas.AnyAsync(c => c.CinemaId == cinemaId);
            if (!cinemaExists)
                return NotFound(new { message = "Cinema not found." });

            var showtimes = await _context.Showtimes
                .Include(s => s.Movie)
                .Include(s => s.Room)
                    .ThenInclude(r => r.Cinema)
                .Where(s => s.Room.CinemaId == cinemaId)
                .Select(s => new ShowtimeDTO
                {
                    ShowtimeID = s.ShowtimeId,
                    MovieID = s.MovieId,
                    MovieTitle = s.Movie.Title,
                    RoomID = s.RoomId,
                    RoomName = s.Room.RoomName,
                    CinemaName = s.Room.Cinema.CinemaName,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    Price = s.Price,
                    Format = s.Format,
                    AvailableSeats = s.AvailableSeats
                })
                .ToListAsync();

            return Ok(showtimes);
        }

        // POST: api/Showtimes
        [HttpPost]
        public async Task<IActionResult> CreateShowtime([FromBody] CreateShowtimeDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var movieExists = await _context.Movies.AnyAsync(m => m.MovieId == dto.MovieID);
            if (!movieExists)
                return BadRequest(new { message = "Movie does not exist." });

            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.RoomId == dto.RoomID);
            if (room == null)
                return BadRequest(new { message = "Room does not exist." });

            if (dto.EndTime <= dto.StartTime)
                return BadRequest(new { message = "EndTime must be greater than StartTime." });

            var showtime = new Showtime
            {
                MovieId = dto.MovieID,
                RoomId = dto.RoomID,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Price = dto.Price,
                Format = dto.Format,
                AvailableSeats = dto.AvailableSeats ?? room.Capacity
            };

            _context.Showtimes.Add(showtime);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Showtime created successfully.",
                showtimeID = showtime.ShowtimeId
            });
        }

        // PUT: api/Showtimes/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateShowtime(int id, [FromBody] UpdateShowtimeDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var showtime = await _context.Showtimes.FindAsync(id);
            if (showtime == null)
                return NotFound(new { message = "Showtime not found." });

            var movieExists = await _context.Movies.AnyAsync(m => m.MovieId == dto.MovieID);
            if (!movieExists)
                return BadRequest(new { message = "Movie does not exist." });

            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.RoomId == dto.RoomID);
            if (room == null)
                return BadRequest(new { message = "Room does not exist." });

            if (dto.EndTime <= dto.StartTime)
                return BadRequest(new { message = "EndTime must be greater than StartTime." });

            showtime.MovieId = dto.MovieID;
            showtime.RoomId = dto.RoomID;
            showtime.StartTime = dto.StartTime;
            showtime.EndTime = dto.EndTime;
            showtime.Price = dto.Price;
            showtime.Format = dto.Format;
            showtime.AvailableSeats = dto.AvailableSeats ?? room.Capacity;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Showtime updated successfully." });
        }

        // DELETE: api/Showtimes/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteShowtime(int id)
        {
            var showtime = await _context.Showtimes
                .Include(s => s.Bookings)
                .FirstOrDefaultAsync(s => s.ShowtimeId == id);

            if (showtime == null)
                return NotFound(new { message = "Showtime not found." });

            if (showtime.Bookings.Any())
                return BadRequest(new { message = "Cannot delete showtime because it has related bookings." });

            _context.Showtimes.Remove(showtime);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Showtime deleted successfully." });
        }
    }
}