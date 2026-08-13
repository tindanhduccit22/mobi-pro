using System.ComponentModel.DataAnnotations;

namespace Mobi.DTOs.Favorites
{
    public class CreateFavoriteDTO
    {
        [Required]
        public int UserID { get; set; }

        [Required]
        public int MovieID { get; set; }
    }
}