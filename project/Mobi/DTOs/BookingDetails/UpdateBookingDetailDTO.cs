using System.ComponentModel.DataAnnotations;

namespace Mobi.DTOs.BookingDetails
{
    public class UpdateBookingDetailDTO
    {
        [Required]
        public int SeatID { get; set; }

        [Required]
        public decimal Price { get; set; }
    }
}