using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Mobi.Models;

[Index("GenreName", Name = "UQ__Genres__BBE1C3392097C5E9", IsUnique = true)]
public partial class Genre
{
    [Key]
    [Column("GenreID")]
    public int GenreId { get; set; }

    [StringLength(50)]
    public string GenreName { get; set; } = null!;

    [InverseProperty("Genre")]
    public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();
}
