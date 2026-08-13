using System.ComponentModel.DataAnnotations;

namespace Mobi.DTOs.Genres
{
    public class UpdateGenreDTO
    {
        [Required]
        [MaxLength(50)]
        public string GenreName { get; set; } = null!;
    }
}