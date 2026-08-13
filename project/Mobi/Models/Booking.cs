using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Mobi.Models;

[Index("BookingCode", Name = "UQ__Bookings__C6E56BD5D064AAC4", IsUnique = true)]
public partial class Booking
{
    [Key]
    [Column("BookingID")]
    public int BookingId { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [Column("ShowtimeID")]
    public int ShowtimeId { get; set; }

    [StringLength(50)]
    public string BookingCode { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime BookingDate { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal TotalAmount { get; set; }

    [StringLength(20)]
    public string Status { get; set; } = null!;

    [Column("QRCode")]
    [StringLength(255)]
    public string? Qrcode { get; set; }

    [InverseProperty("Booking")]
    public virtual ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();

    [InverseProperty("Booking")]
    public virtual Payment? Payment { get; set; }

    [ForeignKey("ShowtimeId")]
    [InverseProperty("Bookings")]
    public virtual Showtime Showtime { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Bookings")]
    public virtual User User { get; set; } = null!;
}
