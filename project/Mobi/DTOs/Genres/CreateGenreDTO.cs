using System.ComponentModel.DataAnnotations;

namespace Mobi.DTOs.Genres
{
    public class CreateGenreDTO
    {
        [Required]
        [MaxLength(50)]
        public string GenreName { get; set; } = null!;
    }
}