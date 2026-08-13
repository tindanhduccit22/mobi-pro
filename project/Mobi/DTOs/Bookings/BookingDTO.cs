namespace Mobi.DTOs.Bookings
{
    public class BookingDTO
    {
        public int BookingID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; } = null!;
        public int ShowtimeID { get; set; }
        public string MovieTitle { get; set; } = null!;
        public DateTime StartTime { get; set; }
        public string BookingCode { get; set; } = null!;
        public DateTime BookingDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = null!;
        public string? QRCode { get; set; }
    }
}