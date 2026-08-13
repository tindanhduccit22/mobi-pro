using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mobi.Data;
using Mobi.DTOs.Payments;
using Mobi.Models;

namespace Mobi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Payments
        [HttpGet]
        public async Task<IActionResult> GetAllPayments()
        {
            var payments = await _context.Payments
                .Include(p => p.Booking)
                .Select(p => new PaymentDTO
                {
                    PaymentID = p.PaymentId,
                    BookingID = p.BookingId,
                    BookingCode = p.Booking.BookingCode,
                    PaymentMethod = p.PaymentMethod,
                    PaymentDate = p.PaymentDate,
                    Amount = p.Amount,
                    PaymentStatus = p.PaymentStatus,
                    TransactionCode = p.TransactionCode
                })
                .ToListAsync();

            return Ok(payments);
        }

        // GET: api/Payments/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPaymentById(int id)
        {
            var payment = await _context.Payments
                .Include(p => p.Booking)
                .Where(p => p.PaymentId == id)
                .Select(p => new PaymentDTO
                {
                    PaymentID = p.PaymentId,
                    BookingID = p.BookingId,
                    BookingCode = p.Booking.BookingCode,
                    PaymentMethod = p.PaymentMethod,
                    PaymentDate = p.PaymentDate,
                    Amount = p.Amount,
                    PaymentStatus = p.PaymentStatus,
                    TransactionCode = p.TransactionCode
                })
                .FirstOrDefaultAsync();

            if (payment == null)
                return NotFound(new { message = "Payment not found." });

            return Ok(payment);
        }

        // GET: api/Payments/booking/3
        [HttpGet("booking/{bookingId:int}")]
        public async Task<IActionResult> GetPaymentByBooking(int bookingId)
        {
            var payment = await _context.Payments
                .Include(p => p.Booking)
                .Where(p => p.BookingId == bookingId)
                .Select(p => new PaymentDTO
                {
                    PaymentID = p.PaymentId,
                    BookingID = p.BookingId,
                    BookingCode = p.Booking.BookingCode,
                    PaymentMethod = p.PaymentMethod,
                    PaymentDate = p.PaymentDate,
                    Amount = p.Amount,
                    PaymentStatus = p.PaymentStatus,
                    TransactionCode = p.TransactionCode
                })
                .FirstOrDefaultAsync();

            if (payment == null)
                return NotFound(new { message = "Payment for this booking not found." });

            return Ok(payment);
        }

        // POST: api/Payments
        [HttpPost]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var booking = await _context.Bookings
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.BookingId == dto.BookingID);

            if (booking == null)
                return BadRequest(new { message = "Booking does not exist." });

            if (booking.Payment != null)
                return BadRequest(new { message = "This booking already has a payment." });

            var payment = new Payment
            {
                BookingId = dto.BookingID,
                PaymentMethod = dto.PaymentMethod.Trim(),
                PaymentDate = DateTime.Now,
                Amount = dto.Amount,
                PaymentStatus = dto.PaymentStatus.Trim(),
                TransactionCode = dto.TransactionCode?.Trim()
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Payment created successfully.",
                paymentID = payment.PaymentId
            });
        }

        // PUT: api/Payments/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdatePayment(int id, [FromBody] UpdatePaymentDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
                return NotFound(new { message = "Payment not found." });

            payment.PaymentMethod = dto.PaymentMethod.Trim();
            payment.Amount = dto.Amount;
            payment.PaymentStatus = dto.PaymentStatus.Trim();
            payment.TransactionCode = dto.TransactionCode?.Trim();

            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment updated successfully." });
        }

        // DELETE: api/Payments/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
                return NotFound(new { message = "Payment not found." });

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment deleted successfully." });
        }
    }
}