using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mobi.Data;
using Mobi.DTOs.BookingDetails;
using Mobi.Models;

namespace Mobi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingDetailsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingDetailsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/BookingDetails
        [HttpGet]
        public async Task<IActionResult> GetAllBookingDetails()
        {
            var details = await _context.BookingDetails
                .Include(d => d.Booking)
                .Include(d => d.Seat)
                .Select(d => new BookingDetailDTO
                {
                    BookingDetailID = d.BookingDetailId,
                    BookingID = d.BookingId,
                    BookingCode = d.Booking.BookingCode,
                    SeatID = d.SeatId,
                    SeatNumber = d.Seat.SeatNumber,
                    Price = d.Price
                })
                .ToListAsync();

            return Ok(details);
        }

        // GET: api/BookingDetails/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetBookingDetailById(int id)
        {
            var detail = await _context.BookingDetails
                .Include(d => d.Booking)
                .Include(d => d.Seat)
                .Where(d => d.BookingDetailId == id)
                .Select(d => new BookingDetailDTO
                {
                    BookingDetailID = d.BookingDetailId,
                    BookingID = d.BookingId,
                    BookingCode = d.Booking.BookingCode,
                    SeatID = d.SeatId,
                    SeatNumber = d.Seat.SeatNumber,
                    Price = d.Price
                })
                .FirstOrDefaultAsync();

            if (detail == null)
                return NotFound(new { message = "Booking detail not found." });

            return Ok(detail);
        }

        // GET: api/BookingDetails/booking/2
        [HttpGet("booking/{bookingId:int}")]
        public async Task<IActionResult> GetBookingDetailsByBooking(int bookingId)
        {
            var bookingExists = await _context.Bookings.AnyAsync(b => b.BookingId == bookingId);
            if (!bookingExists)
                return NotFound(new { message = "Booking not found." });

            var details = await _context.BookingDetails
                .Include(d => d.Booking)
                .Include(d => d.Seat)
                .Where(d => d.BookingId == bookingId)
                .Select(d => new BookingDetailDTO
                {
                    BookingDetailID = d.BookingDetailId,
                    BookingID = d.BookingId,
                    BookingCode = d.Booking.BookingCode,
                    SeatID = d.SeatId,
                    SeatNumber = d.Seat.SeatNumber,
                    Price = d.Price
                })
                .ToListAsync();

            return Ok(details);
        }

        // POST: api/BookingDetails
        [HttpPost]
        public async Task<IActionResult> CreateBookingDetail([FromBody] CreateBookingDetailDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var bookingExists = await _context.Bookings.AnyAsync(b => b.BookingId == dto.BookingID);
            if (!bookingExists)
                return BadRequest(new { message = "Booking does not exist." });

            var seatExists = await _context.Seats.AnyAsync(s => s.SeatId == dto.SeatID);
            if (!seatExists)
                return BadRequest(new { message = "Seat does not exist." });

            var duplicate = await _context.BookingDetails.AnyAsync(d =>
                d.BookingId == dto.BookingID && d.SeatId == dto.SeatID);

            if (duplicate)
                return BadRequest(new { message = "This seat is already in the booking." });

            var detail = new BookingDetail
            {
                BookingId = dto.BookingID,
                SeatId = dto.SeatID,
                Price = dto.Price
            };

            _context.BookingDetails.Add(detail);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Booking detail created successfully.",
                bookingDetailID = detail.BookingDetailId
            });
        }

        // PUT: api/BookingDetails/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateBookingDetail(int id, [FromBody] UpdateBookingDetailDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var detail = await _context.BookingDetails.FindAsync(id);
            if (detail == null)
                return NotFound(new { message = "Booking detail not found." });

            var seatExists = await _context.Seats.AnyAsync(s => s.SeatId == dto.SeatID);
            if (!seatExists)
                return BadRequest(new { message = "Seat does not exist." });

            var duplicate = await _context.BookingDetails.AnyAsync(d =>
                d.BookingDetailId != id &&
                d.BookingId == detail.BookingId &&
                d.SeatId == dto.SeatID);

            if (duplicate)
                return BadRequest(new { message = "This seat is already in the booking." });

            detail.SeatId = dto.SeatID;
            detail.Price = dto.Price;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking detail updated successfully." });
        }

        // DELETE: api/BookingDetails/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteBookingDetail(int id)
        {
            var detail = await _context.BookingDetails.FindAsync(id);
            if (detail == null)
                return NotFound(new { message = "Booking detail not found." });

            _context.BookingDetails.Remove(detail);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking detail deleted successfully." });
        }
    }
}