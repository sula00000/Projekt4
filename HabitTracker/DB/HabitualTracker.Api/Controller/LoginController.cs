using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HabitualTracker.Api.Models;
using HabitualTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace HabitualTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly LoginService _loginService;
    private readonly IConfiguration _configuration;

    public LoginController(LoginService loginService, IConfiguration configuration)
    {
        _loginService = loginService;
        _configuration = configuration;
    }

    // POST /api/login/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(LoginRegisterDto dto)
    {
        var existing = await _loginService.GetByEmailAsync(dto.Email);
        if (existing != null)
        {
            return BadRequest("Email er allerede i brug.");
        }

        var login = new Login
        {
            Email = dto.Email,
            Password = dto.Password   // gemmer klartekst (kun til øvelse!)
        };

        await _loginService.CreateAsync(login);

        return Ok(new { message = "Bruger oprettet." });
    }

    // POST /api/login/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginLoginDto dto)
    {
        var login = await _loginService.GetByEmailAsync(dto.Email);
        if (login == null || login.Password != dto.Password)
        {
            return Unauthorized("Forkert email eller password.");
        }

        var token = GenerateJwt(login);
        return Ok(new { token });
    }

    private string GenerateJwt(Login login)
    {
        var jwtSection = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, login.Id ?? ""),
            new Claim(JwtRegisteredClaimNames.Email, login.Email)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSection["Issuer"],
            audience: jwtSection["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
