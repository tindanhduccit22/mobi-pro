using Microsoft.AspNetCore.Mvc;
using Mobi.Data;
using Mobi.DTOs.Users;
using Microsoft.EntityFrameworkCore;

namespace Mobi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProfileController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            var user = await _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Email,
                    u.Phone,
                    u.Gender,
                    u.AvatarUrl,
                    u.DateOfBirth,
                    u.Role,
                    u.IsActive,
                    u.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(user);
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateProfile(int userId, [FromBody] UpdateProfileDTO dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            user.FullName = dto.FullName;
            user.Phone = dto.Phone;
            user.Gender = dto.Gender;
            user.AvatarUrl = dto.AvatarURL;
            if (dto.DateOfBirth.HasValue)
            {
                user.DateOfBirth = DateOnly.FromDateTime(dto.DateOfBirth.Value);
            }
            else
            {
                user.DateOfBirth = null;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully." });
        }
    }
}
