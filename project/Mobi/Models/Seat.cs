using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Mobi.Models;

[Index("RoomId", "SeatNumber", Name = "UQ_Seats_Room_SeatNumber", IsUnique = true)]
public partial class Seat
{
    [Key]
    [Column("SeatID")]
    public int SeatId { get; set; }

    [Column("RoomID")]
    public int RoomId { get; set; }

    [StringLength(10)]
    public string SeatNumber { get; set; } = null!;

    [StringLength(20)]
    public string SeatType { get; set; } = null!;

    public bool IsActive { get; set; }

    [InverseProperty("Seat")]
    public virtual ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();

    [ForeignKey("RoomId")]
    [InverseProperty("Seats")]
    public virtual Room Room { get; set; } = null!;
}
