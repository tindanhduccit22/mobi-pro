namespace Mobi.DTOs.Users
{
    public class UpdateProfileDTO
    {
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Gender { get; set; }
        public string? AvatarURL { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}
