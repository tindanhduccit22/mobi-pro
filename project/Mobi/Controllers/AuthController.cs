using Microsoft.AspNetCore.Mvc;
using Mobi.Data;
using Mobi.DTOs.Auth;
using Mobi.Models;
using Mobi.Services;

namespace Mobi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterRequestDTO dto)
        {
            if (_context.Users.Any(u => u.Email == dto.Email))
            {
                return BadRequest(new { message = "Email already exists." });
            }

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Phone = dto.Phone,
                Gender = dto.Gender,
                Role = "Customer",
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new AuthResponseDTO
            {
                UserID = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Message = "Register successfully"
            });
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequestDTO dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new AuthResponseDTO
            {
                UserID = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Message = "Login successfully",
                Token = token
            });
        }
    }
}