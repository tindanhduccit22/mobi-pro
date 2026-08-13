namespace Mobi.DTOs.Auth
{
    public class AuthResponseDTO
    {
        public int UserID { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string? Token { get; set; }
    }
}