using System.ComponentModel.DataAnnotations;

namespace Mobi.DTOs.Bookings
{
    public class UpdateBookingDTO
    {
        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = null!;

        [MaxLength(255)]
        public string? QRCode { get; set; }
    }
}