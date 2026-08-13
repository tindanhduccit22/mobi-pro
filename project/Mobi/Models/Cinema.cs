using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Mobi.Models;

public partial class Cinema
{
    [Key]
    [Column("CinemaID")]
    public int CinemaId { get; set; }

    [StringLength(150)]
    public string CinemaName { get; set; } = null!;

    [StringLength(255)]
    public string Address { get; set; } = null!;

    [StringLength(100)]
    public string? City { get; set; }

    [StringLength(20)]
    public string? Phone { get; set; }

    [InverseProperty("Cinema")]
    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
}
