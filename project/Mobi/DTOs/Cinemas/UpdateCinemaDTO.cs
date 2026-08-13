using System.ComponentModel.DataAnnotations;

namespace Mobi.DTOs.Cinemas
{
    public class UpdateCinemaDTO
    {
        [Required]
        [MaxLength(150)]
        public string CinemaName { get; set; } = null!;

        [Required]
        [MaxLength(255)]
        public string Address { get; set; } = null!;

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }
    }
}