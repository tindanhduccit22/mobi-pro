using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mobi.Data;
using Mobi.DTOs.Seats;
using Mobi.Models;

namespace Mobi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SeatsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Seats
        [HttpGet]
        public async Task<IActionResult> GetAllSeats()
        {
            var seats = await _context.Seats
                .Include(s => s.Room)
                .Select(s => new SeatDTO
                {
                    SeatID = s.SeatId,
                    RoomID = s.RoomId,
                    RoomName = s.Room.RoomName,
                    SeatNumber = s.SeatNumber,
                    SeatType = s.SeatType,
                    IsActive = s.IsActive
                })
                .ToListAsync();

            return Ok(seats);
        }

        // GET: api/Seats/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetSeatById(int id)
        {
            var seat = await _context.Seats
                .Include(s => s.Room)
                .Where(s => s.SeatId == id)
                .Select(s => new SeatDTO
                {
                    SeatID = s.SeatId,
                    RoomID = s.RoomId,
                    RoomName = s.Room.RoomName,
                    SeatNumber = s.SeatNumber,
                    SeatType = s.SeatType,
                    IsActive = s.IsActive
                })
                .FirstOrDefaultAsync();

            if (seat == null)
                return NotFound(new { message = "Seat not found." });

            return Ok(seat);
        }

        // GET: api/Seats/room/3
        [HttpGet("room/{roomId:int}")]
        public async Task<IActionResult> GetSeatsByRoom(int roomId)
        {
            var roomExists = await _context.Rooms.AnyAsync(r => r.RoomId == roomId);
            if (!roomExists)
                return NotFound(new { message = "Room not found." });

            var seats = await _context.Seats
                .Include(s => s.Room)
                .Where(s => s.RoomId == roomId)
                .Select(s => new SeatDTO
                {
                    SeatID = s.SeatId,
                    RoomID = s.RoomId,
                    RoomName = s.Room.RoomName,
                    SeatNumber = s.SeatNumber,
                    SeatType = s.SeatType,
                    IsActive = s.IsActive
                })
                .ToListAsync();

            return Ok(seats);
        }

        // POST: api/Seats
        [HttpPost]
        public async Task<IActionResult> CreateSeat([FromBody] CreateSeatDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var roomExists = await _context.Rooms.AnyAsync(r => r.RoomId == dto.RoomID);
            if (!roomExists)
                return BadRequest(new { message = "Room does not exist." });

            var duplicate = await _context.Seats.AnyAsync(s =>
                s.RoomId == dto.RoomID &&
                s.SeatNumber.ToLower() == dto.SeatNumber.Trim().ToLower());

            if (duplicate)
                return BadRequest(new { message = "Seat number already exists in this room." });

            var seat = new Seat
            {
                RoomId = dto.RoomID,
                SeatNumber = dto.SeatNumber.Trim(),
                SeatType = dto.SeatType.Trim(),
                IsActive = dto.IsActive
            };

            _context.Seats.Add(seat);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Seat created successfully.",
                seatID = seat.SeatId
            });
        }

        // PUT: api/Seats/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateSeat(int id, [FromBody] UpdateSeatDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var seat = await _context.Seats.FindAsync(id);
            if (seat == null)
                return NotFound(new { message = "Seat not found." });

            var roomExists = await _context.Rooms.AnyAsync(r => r.RoomId == dto.RoomID);
            if (!roomExists)
                return BadRequest(new { message = "Room does not exist." });

            var duplicate = await _context.Seats.AnyAsync(s =>
                s.SeatId != id &&
                s.RoomId == dto.RoomID &&
                s.SeatNumber.ToLower() == dto.SeatNumber.Trim().ToLower());

            if (duplicate)
                return BadRequest(new { message = "Seat number already exists in this room." });

            seat.RoomId = dto.RoomID;
            seat.SeatNumber = dto.SeatNumber.Trim();
            seat.SeatType = dto.SeatType.Trim();
            seat.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Seat updated successfully." });
        }

        // DELETE: api/Seats/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteSeat(int id)
        {
            var seat = await _context.Seats
                .Include(s => s.BookingDetails)
                .FirstOrDefaultAsync(s => s.SeatId == id);

            if (seat == null)
                return NotFound(new { message = "Seat not found." });

            if (seat.BookingDetails.Any())
                return BadRequest(new { message = "Cannot delete seat because it has related booking details." });

            _context.Seats.Remove(seat);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Seat deleted successfully." });
        }
    }
}