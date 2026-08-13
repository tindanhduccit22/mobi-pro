using System.ComponentModel.DataAnnotations;

namespace Mobi.DTOs.Reviews
{
    public class CreateReviewDTO
    {
        [Required]
        public int UserID { get; set; }

        [Required]
        public int MovieID { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(500)]
        public string? Comment { get; set; }
    }
}