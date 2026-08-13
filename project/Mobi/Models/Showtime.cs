using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Mobi.Models;

public partial class Showtime
{
    [Key]
    [Column("ShowtimeID")]
    public int ShowtimeId { get; set; }

    [Column("MovieID")]
    public int MovieId { get; set; }

    [Column("RoomID")]
    public int RoomId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime StartTime { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime EndTime { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Price { get; set; }

    [StringLength(20)]
    public string? Format { get; set; }

    public int? AvailableSeats { get; set; }

    [InverseProperty("Showtime")]
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    [ForeignKey("MovieId")]
    [InverseProperty("Showtimes")]
    public virtual Movie Movie { get; set; } = null!;

    [ForeignKey("RoomId")]
    [InverseProperty("Showtimes")]
    public virtual Room Room { get; set; } = null!;
}
