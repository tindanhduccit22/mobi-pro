namespace Mobi.DTOs.Payments
{
    public class PaymentDTO
    {
        public int PaymentID { get; set; }
        public int BookingID { get; set; }
        public string BookingCode { get; set; } = null!;
        public string PaymentMethod { get; set; } = null!;
        public DateTime PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public string PaymentStatus { get; set; } = null!;
        public string? TransactionCode { get; set; }
    }
}