using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Mobi.Models;

[Index("UserId", "MovieId", Name = "UQ_Favorites_User_Movie", IsUnique = true)]
public partial class Favorite
{
    [Key]
    [Column("FavoriteID")]
    public int FavoriteId { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [Column("MovieID")]
    public int MovieId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedAt { get; set; }

    [ForeignKey("MovieId")]
    [InverseProperty("Favorites")]
    public virtual Movie Movie { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Favorites")]
    public virtual User User { get; set; } = null!;
}
