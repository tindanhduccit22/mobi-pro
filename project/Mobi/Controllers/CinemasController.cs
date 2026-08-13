using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mobi.Data;
using Mobi.DTOs.Cinemas;
using Mobi.Models;

namespace Mobi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CinemasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CinemasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Cinemas
        [HttpGet]
        public async Task<IActionResult> GetAllCinemas()
        {
            var cinemas = await _context.Cinemas
                .Select(c => new CinemaDTO
                {
                    CinemaID = c.CinemaId,
                    CinemaName = c.CinemaName,
                    Address = c.Address,
                    City = c.City,
                    Phone = c.Phone
                })
                .ToListAsync();

            return Ok(cinemas);
        }

        // GET: api/Cinemas/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCinemaById(int id)
        {
            var cinema = await _context.Cinemas
                .Include(c => c.Rooms)
                .Where(c => c.CinemaId == id)
                .Select(c => new CinemaDetailDTO
                {
                    CinemaID = c.CinemaId,
                    CinemaName = c.CinemaName,
                    Address = c.Address,
                    City = c.City,
                    Phone = c.Phone,
                    TotalRooms = c.Rooms.Count
                })
                .FirstOrDefaultAsync();

            if (cinema == null)
                return NotFound(new { message = "Cinema not found." });

            return Ok(cinema);
        }

        // POST: api/Cinemas
        [HttpPost]
        public async Task<IActionResult> CreateCinema([FromBody] CreateCinemaDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cinema = new Cinema
            {
                CinemaName = dto.CinemaName.Trim(),
                Address = dto.Address.Trim(),
                City = dto.City,
                Phone = dto.Phone
            };

            _context.Cinemas.Add(cinema);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cinema created successfully.",
                cinemaID = cinema.CinemaId
            });
        }

        // PUT: api/Cinemas/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCinema(int id, [FromBody] UpdateCinemaDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var cinema = await _context.Cinemas.FindAsync(id);
            if (cinema == null)
                return NotFound(new { message = "Cinema not found." });

            cinema.CinemaName = dto.CinemaName.Trim();
            cinema.Address = dto.Address.Trim();
            cinema.City = dto.City;
            cinema.Phone = dto.Phone;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cinema updated successfully." });
        }

        // DELETE: api/Cinemas/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCinema(int id)
        {
            var cinema = await _context.Cinemas
                .Include(c => c.Rooms)
                .FirstOrDefaultAsync(c => c.CinemaId == id);

            if (cinema == null)
                return NotFound(new { message = "Cinema not found." });

            if (cinema.Rooms.Any())
                return BadRequest(new { message = "Cannot delete cinema because it has related rooms." });

            _context.Cinemas.Remove(cinema);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cinema deleted successfully." });
        }
    }
}