using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mobi.Data;
using Mobi.DTOs.Rooms;
using Mobi.Models;

namespace Mobi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Rooms
        [HttpGet]
        public async Task<IActionResult> GetAllRooms()
        {
            var rooms = await _context.Rooms
                .Include(r => r.Cinema)
                .Select(r => new RoomDTO
                {
                    RoomID = r.RoomId,
                    CinemaID = r.CinemaId,
                    CinemaName = r.Cinema.CinemaName,
                    RoomName = r.RoomName,
                    Capacity = r.Capacity
                })
                .ToListAsync();

            return Ok(rooms);
        }

        // GET: api/Rooms/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetRoomById(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.Cinema)
                .Include(r => r.Seats)
                .Include(r => r.Showtimes)
                .Where(r => r.RoomId == id)
                .Select(r => new RoomDetailDTO
                {
                    RoomID = r.RoomId,
                    CinemaID = r.CinemaId,
                    CinemaName = r.Cinema.CinemaName,
                    RoomName = r.RoomName,
                    Capacity = r.Capacity,
                    TotalSeats = r.Seats.Count,
                    TotalShowtimes = r.Showtimes.Count
                })
                .FirstOrDefaultAsync();

            if (room == null)
                return NotFound(new { message = "Room not found." });

            return Ok(room);
        }

        // GET: api/Rooms/cinema/2
        [HttpGet("cinema/{cinemaId:int}")]
        public async Task<IActionResult> GetRoomsByCinema(int cinemaId)
        {
            var cinemaExists = await _context.Cinemas.AnyAsync(c => c.CinemaId == cinemaId);
            if (!cinemaExists)
                return NotFound(new { message = "Cinema not found." });

            var rooms = await _context.Rooms
                .Include(r => r.Cinema)
                .Where(r => r.CinemaId == cinemaId)
                .Select(r => new RoomDTO
                {
                    RoomID = r.RoomId,
                    CinemaID = r.CinemaId,
                    CinemaName = r.Cinema.CinemaName,
                    RoomName = r.RoomName,
                    Capacity = r.Capacity
                })
                .ToListAsync();

            return Ok(rooms);
        }

        // POST: api/Rooms
        [HttpPost]
        public async Task<IActionResult> CreateRoom([FromBody] CreateRoomDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (dto.Capacity <= 0)
                return BadRequest(new { message = "Capacity must be greater than 0." });

            var cinemaExists = await _context.Cinemas.AnyAsync(c => c.CinemaId == dto.CinemaID);
            if (!cinemaExists)
                return BadRequest(new { message = "Cinema does not exist." });

            var duplicate = await _context.Rooms.AnyAsync(r =>
                r.CinemaId == dto.CinemaID &&
                r.RoomName.ToLower() == dto.RoomName.Trim().ToLower());

            if (duplicate)
                return BadRequest(new { message = "Room name already exists in this cinema." });

            var room = new Room
            {
                CinemaId = dto.CinemaID,
                RoomName = dto.RoomName.Trim(),
                Capacity = dto.Capacity
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Room created successfully.",
                roomID = room.RoomId
            });
        }

        // PUT: api/Rooms/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] UpdateRoomDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (dto.Capacity <= 0)
                return BadRequest(new { message = "Capacity must be greater than 0." });

            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
                return NotFound(new { message = "Room not found." });

            var cinemaExists = await _context.Cinemas.AnyAsync(c => c.CinemaId == dto.CinemaID);
            if (!cinemaExists)
                return BadRequest(new { message = "Cinema does not exist." });

            var duplicate = await _context.Rooms.AnyAsync(r =>
                r.RoomId != id &&
                r.CinemaId == dto.CinemaID &&
                r.RoomName.ToLower() == dto.RoomName.Trim().ToLower());

            if (duplicate)
                return BadRequest(new { message = "Room name already exists in this cinema." });

            room.CinemaId = dto.CinemaID;
            room.RoomName = dto.RoomName.Trim();
            room.Capacity = dto.Capacity;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Room updated successfully." });
        }

        // DELETE: api/Rooms/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.Seats)
                .Include(r => r.Showtimes)
                .FirstOrDefaultAsync(r => r.RoomId == id);

            if (room == null)
                return NotFound(new { message = "Room not found." });

            if (room.Seats.Any() || room.Showtimes.Any())
                return BadRequest(new { message = "Cannot delete room because it has related seats or showtimes." });

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Room deleted successfully." });
        }
    }
}