using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Mobi.Models;

[Index("UserId", "MovieId", Name = "UQ_Reviews_User_Movie", IsUnique = true)]
public partial class Review
{
    [Key]
    [Column("ReviewID")]
    public int ReviewId { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [Column("MovieID")]
    public int MovieId { get; set; }

    public int Rating { get; set; }

    [StringLength(500)]
    public string? Comment { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime ReviewDate { get; set; }

    [ForeignKey("MovieId")]
    [InverseProperty("Reviews")]
    public virtual Movie Movie { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Reviews")]
    public virtual User User { get; set; } = null!;
}
