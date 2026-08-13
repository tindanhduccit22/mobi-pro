namespace Mobi.DTOs.Auth
{
    public class RegisterRequestDTO
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Gender { get; set; }
    }
}