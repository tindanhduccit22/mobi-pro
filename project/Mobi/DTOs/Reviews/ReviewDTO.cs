namespace Mobi.DTOs.Reviews
{
    public class ReviewDTO
    {
        public int ReviewID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; } = null!;
        public int MovieID { get; set; }
        public string MovieTitle { get; set; } = null!;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime ReviewDate { get; set; }
    }
}