using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Mobi.Models;

public partial class Movie
{
    [Key]
    [Column("MovieID")]
    public int MovieId { get; set; }

    [Column("GenreID")]
    public int GenreId { get; set; }

    [StringLength(200)]
    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int Duration { get; set; }

    public DateOnly? ReleaseDate { get; set; }

    [StringLength(50)]
    public string? Language { get; set; }

    [StringLength(50)]
    public string? Country { get; set; }

    [StringLength(100)]
    public string? Director { get; set; }

    [StringLength(255)]
    public string? Cast { get; set; }

    [Column("PosterURL")]
    [StringLength(255)]
    public string? PosterUrl { get; set; }

    [Column("BannerURL")]
    [StringLength(255)]
    public string? BannerUrl { get; set; }

    [Column("TrailerURL")]
    [StringLength(255)]
    public string? TrailerUrl { get; set; }

    [StringLength(20)]
    public string? AgeRating { get; set; }

    [StringLength(30)]
    public string Status { get; set; } = null!;

    [InverseProperty("Movie")]
    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

    [ForeignKey("GenreId")]
    [InverseProperty("Movies")]
    public virtual Genre Genre { get; set; } = null!;

    [InverseProperty("Movie")]
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    [InverseProperty("Movie")]
    public virtual ICollection<Showtime> Showtimes { get; set; } = new List<Showtime>();
}
