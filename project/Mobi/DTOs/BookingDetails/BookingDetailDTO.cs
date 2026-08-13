namespace Mobi.DTOs.BookingDetails
{
    public class BookingDetailDTO
    {
        public int BookingDetailID { get; set; }
        public int BookingID { get; set; }
        public string BookingCode { get; set; } = null!;
        public int SeatID { get; set; }
        public string SeatNumber { get; set; } = null!;
        public decimal Price { get; set; }
    }
}