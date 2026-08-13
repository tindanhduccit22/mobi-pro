namespace Mobi.DTOs.Showtimes
{
    public class ShowtimeDTO
    {
        public int ShowtimeID { get; set; }
        public int MovieID { get; set; }
        public string MovieTitle { get; set; } = null!;
        public int RoomID { get; set; }
        public string RoomName { get; set; } = null!;
        public string CinemaName { get; set; } = null!;

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal Price { get; set; }
        public string? Format { get; set; }
        public int? AvailableSeats { get; set; }
    }
}