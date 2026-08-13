namespace Mobi.DTOs.Bookings
{
    public class BookingResponseDTO
    {
        public int BookingID { get; set; }
        public string BookingCode { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = null!;
        public DateTime BookingDate { get; set; }
    }
}