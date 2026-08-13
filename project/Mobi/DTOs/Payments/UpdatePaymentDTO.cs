using System.ComponentModel.DataAnnotations;

namespace Mobi.DTOs.Payments
{
    public class UpdatePaymentDTO
    {
        [Required]
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = null!;

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(20)]
        public string PaymentStatus { get; set; } = null!;

        [MaxLength(100)]
        public string? TransactionCode { get; set; }
    }
}