using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Mobi.Models;

[Index("BookingId", Name = "UQ__Payments__73951ACCA8482536", IsUnique = true)]
public partial class Payment
{
    [Key]
    [Column("PaymentID")]
    public int PaymentId { get; set; }

    [Column("BookingID")]
    public int BookingId { get; set; }

    [StringLength(50)]
    public string PaymentMethod { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime PaymentDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Amount { get; set; }

    [StringLength(20)]
    public string PaymentStatus { get; set; } = null!;

    [StringLength(100)]
    public string? TransactionCode { get; set; }

    [ForeignKey("BookingId")]
    [InverseProperty("Payment")]
    public virtual Booking Booking { get; set; } = null!;
}
