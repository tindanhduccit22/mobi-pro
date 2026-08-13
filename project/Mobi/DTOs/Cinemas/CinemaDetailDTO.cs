namespace Mobi.DTOs.Cinemas
{
    public class CinemaDetailDTO
    {
        public int CinemaID { get; set; }
        public string CinemaName { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string? City { get; set; }
        public string? Phone { get; set; }

        public int TotalRooms { get; set; }
    }
}