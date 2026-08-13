namespace Mobi.DTOs.Seats
{
    public class SeatDTO
    {
        public int SeatID { get; set; }
        public int RoomID { get; set; }
        public string RoomName { get; set; } = null!;
        public string SeatNumber { get; set; } = null!;
        public string SeatType { get; set; } = null!;
        public bool IsActive { get; set; }
    }
}