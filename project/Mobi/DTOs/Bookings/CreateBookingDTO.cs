using System.ComponentModel.DataAnnotations;

namespace Mobi.DTOs.Bookings
{
    public class CreateBookingDTO
    {
        [Required]
        public int UserID { get; set; }

        [Required]
        public int ShowtimeID { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = null!;

        [MaxLength(255)]
        public string? QRCode { get; set; }
    }
}