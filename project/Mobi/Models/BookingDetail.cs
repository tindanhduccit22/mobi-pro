using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Mobi.Models;

[Table("Booking_Details")]
public partial class BookingDetail
{
    [Key]
    [Column("BookingDetailID")]
    public int BookingDetailId { get; set; }

    [Column("BookingID")]
    public int BookingId { get; set; }

    [Column("SeatID")]
    public int SeatId { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Price { get; set; }

    [ForeignKey("BookingId")]
    [InverseProperty("BookingDetails")]
    public virtual Booking Booking { get; set; } = null!;

    [ForeignKey("SeatId")]
    [InverseProperty("BookingDetails")]
    public virtual Seat Seat { get; set; } = null!;
}
