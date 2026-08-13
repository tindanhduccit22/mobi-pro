using System.ComponentModel.DataAnnotations;

namespace Mobi.DTOs.Rooms
{
    public class CreateRoomDTO
    {
        [Required]
        public int CinemaID { get; set; }

        [Required]
        [MaxLength(50)]
        public string RoomName { get; set; } = null!;

        [Required]
        public int Capacity { get; set; }
    }
}