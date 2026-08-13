namespace Mobi.DTOs.Rooms
{
    public class RoomDTO
    {
        public int RoomID { get; set; }
        public int CinemaID { get; set; }
        public string CinemaName { get; set; } = null!;
        public string RoomName { get; set; } = null!;
        public int Capacity { get; set; }
    }
}