namespace Mobi.DTOs.Movies
{
    public class MovieDTO
    {
        public int MovieID { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int Duration { get; set; }
        public DateOnly? ReleaseDate { get; set; }
        public string? Language { get; set; }
        public string? Country { get; set; }
        public string? Director { get; set; }
        public string? Cast { get; set; }
        public string? PosterURL { get; set; }
        public string? BannerURL { get; set; }
        public string? TrailerURL { get; set; }
        public string? AgeRating { get; set; }
        public string? Status { get; set; }
        public string GenreName { get; set; } = null!;
    }
}