using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mobi.Data;
using Mobi.DTOs.Bookings;
using Mobi.Models;

namespace Mobi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Showtime)
                    .ThenInclude(s => s.Movie)
                .Select(b => new BookingDTO
                {
                    BookingID = b.BookingId,
                    UserID = b.UserId,
                    UserName = b.User.FullName,
                    ShowtimeID = b.ShowtimeId,
                    MovieTitle = b.Showtime.Movie.Title,
                    StartTime = b.Showtime.StartTime,
                    BookingCode = b.BookingCode,
                    BookingDate = b.BookingDate,
                    TotalAmount = b.TotalAmount,
                    Status = b.Status,
                    QRCode = b.Qrcode
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // GET: api/Bookings/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetBookingById(int id)
        {

            var booking = await _context.Bookings

            .Include(b => b.Showtime)
                .ThenInclude(s => s.Movie)

            .Include(b => b.Showtime)
                .ThenInclude(s => s.Room)
                    .ThenInclude(r => r.Cinema)

            .Include(b => b.BookingDetails)
                .ThenInclude(d => d.Seat)


            .FirstOrDefaultAsync(
                b => b.BookingId == id
            );



            if (booking == null)
                return NotFound();



            return Ok(new
            {

                bookingID = booking.BookingId,

                bookingCode = booking.BookingCode,


                movieTitle =
            booking.Showtime.Movie.Title,


                cinemaName =
            booking.Showtime.Room.Cinema.CinemaName,


                roomName =
            booking.Showtime.Room.RoomName,


                startTime =
            booking.Showtime.StartTime,


                seats =
            booking.BookingDetails
            .Select(x => x.Seat.SeatNumber)
            .ToList(),


                totalAmount =
            booking.TotalAmount,


                status =
            booking.Status,


                qrCode =
            booking.Qrcode


            });


        }

        // GET: api/Bookings/user/2
        [HttpGet("user/{userId:int}")]
        public async Task<IActionResult> GetBookingsByUser(int userId)
        {
            var userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
            if (!userExists)
                return NotFound(new { message = "User not found." });

            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Showtime)
                    .ThenInclude(s => s.Movie)
                .Where(b => b.UserId == userId)
                .Select(b => new BookingDTO
                {
                    BookingID = b.BookingId,
                    UserID = b.UserId,
                    UserName = b.User.FullName,
                    ShowtimeID = b.ShowtimeId,
                    MovieTitle = b.Showtime.Movie.Title,
                    StartTime = b.Showtime.StartTime,
                    BookingCode = b.BookingCode,
                    BookingDate = b.BookingDate,
                    TotalAmount = b.TotalAmount,
                    Status = b.Status,
                    QRCode = b.Qrcode
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // POST: api/Bookings
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userExists = await _context.Users.AnyAsync(u => u.UserId == dto.UserID);
            if (!userExists)
                return BadRequest(new { message = "User does not exist." });

            var showtimeExists = await _context.Showtimes.AnyAsync(s => s.ShowtimeId == dto.ShowtimeID);
            if (!showtimeExists)
                return BadRequest(new { message = "Showtime does not exist." });

            var booking = new Booking
            {
                UserId = dto.UserID,
                ShowtimeId = dto.ShowtimeID,
                BookingCode = $"BK{DateTime.Now:yyyyMMddHHmmss}",
                BookingDate = DateTime.Now,
                TotalAmount = dto.TotalAmount,
                Status = dto.Status.Trim(),
                Qrcode = dto.QRCode
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Booking created successfully.",
                bookingID = booking.BookingId,
                bookingCode = booking.BookingCode
            });
        }

        // PUT: api/Bookings/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateBooking(int id, [FromBody] UpdateBookingDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
                return NotFound(new { message = "Booking not found." });

            booking.TotalAmount = dto.TotalAmount;
            booking.Status = dto.Status.Trim();
            booking.Qrcode = dto.QRCode;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking updated successfully." });
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.BookingDetails)
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.BookingId == id);

            if (booking == null)
                return NotFound(new { message = "Booking not found." });

            if (booking.BookingDetails.Any() || booking.Payment != null)
                return BadRequest(new { message = "Cannot delete booking because it has related booking details or payment." });

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking deleted successfully." });
        }
    }
}