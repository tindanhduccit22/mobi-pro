using System.ComponentModel.DataAnnotations;

namespace Mobi.DTOs.Showtimes
{
    public class UpdateShowtimeDTO
    {
        [Required]
        public int MovieID { get; set; }

        [Required]
        public int RoomID { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [Required]
        public decimal Price { get; set; }

        [MaxLength(20)]
        public string? Format { get; set; }

        public int? AvailableSeats { get; set; }
    }
}