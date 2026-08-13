using System.ComponentModel.DataAnnotations;

namespace Mobi.DTOs.BookingDetails
{
    public class CreateBookingDetailDTO
    {
        [Required]
        public int BookingID { get; set; }

        [Required]
        public int SeatID { get; set; }

        [Required]
        public decimal Price { get; set; }
    }
}