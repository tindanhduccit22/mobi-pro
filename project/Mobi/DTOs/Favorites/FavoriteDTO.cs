namespace Mobi.DTOs.Favorites
{
    public class FavoriteDTO
    {
        public int FavoriteID { get; set; }

        public int UserID { get; set; }

        public string UserName { get; set; }


        public int MovieID { get; set; }

        public string MovieTitle { get; set; }


        public string PosterUrl { get; set; }

        public string GenreName { get; set; }

        public int Duration { get; set; }


        public DateTime CreatedAt { get; set; }
    }
}