using System.ComponentModel.DataAnnotations;

namespace Mobi.DTOs.Seats
{
    public class CreateSeatDTO
    {
        [Required]
        public int RoomID { get; set; }

        [Required]
        [MaxLength(10)]
        public string SeatNumber { get; set; } = null!;

        [Required]
        [MaxLength(20)]
        public string SeatType { get; set; } = null!;

        public bool IsActive { get; set; } = true;
    }
}