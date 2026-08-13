using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Mobi.Models;

public partial class Room
{
    [Key]
    [Column("RoomID")]
    public int RoomId { get; set; }

    [Column("CinemaID")]
    public int CinemaId { get; set; }

    [StringLength(50)]
    public string RoomName { get; set; } = null!;

    public int Capacity { get; set; }

    [ForeignKey("CinemaId")]
    [InverseProperty("Rooms")]
    public virtual Cinema Cinema { get; set; } = null!;

    [InverseProperty("Room")]
    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();

    [InverseProperty("Room")]
    public virtual ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
}
