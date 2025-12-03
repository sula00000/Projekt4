using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using HabitualTracker.Api.Models;
using HabitualTracker.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HabitualTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // kræver login på alle endpoints
public class HabitsController : ControllerBase
{
    private readonly HabitService _habitService;

    public HabitsController(HabitService habitService)
    {
        _habitService = habitService;
    }

    private string? GetUserId()
    {
        // Debug: print all claims
        Console.WriteLine("=== ALL CLAIMS ===");
        foreach (var claim in User.Claims)
        {
            Console.WriteLine($"  Type: '{claim.Type}', Value: '{claim.Value}'");
        }
        Console.WriteLine("==================");
        
        // Try multiple ways to get the sub claim
        var userId1 = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        var userId2 = User.FindFirst("sub")?.Value;
        var userId3 = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        Console.WriteLine($"JwtRegisteredClaimNames.Sub: '{userId1}'");
        Console.WriteLine($"Direct 'sub': '{userId2}'");
        Console.WriteLine($"ClaimTypes.NameIdentifier: '{userId3}'");
        
        return userId1 ?? userId2 ?? userId3;
    }

    // GET /api/habits (kun dine egne)
    [HttpGet]
    public async Task<ActionResult<List<Habit>>> GetAll()
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var habits = await _habitService.GetByOwnerAsync(userId);
        return Ok(habits);
    }

    // GET /api/habits/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Habit>> GetById(string id)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var habit = await _habitService.GetByIdAsync(id);
        if (habit == null || habit.OwnerId != userId) return NotFound();

        return Ok(habit);
    }

    // POST /api/habits
    [HttpPost]
    public async Task<ActionResult<Habit>> Create(HabitCreateDto dto)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var habit = new Habit
        {
            OwnerId = userId,                  // ← kobler vanen til brugeren
            Name = dto.Name,
            Description = dto.Description,
            Difficulty = dto.Difficulty,
            ResetCounter = dto.ResetCounter,
            Value = dto.Value,
            CreatedAt = DateTime.UtcNow
        };

        await _habitService.CreateAsync(habit);

        return CreatedAtAction(nameof(GetById), new { id = habit.Id }, habit);
    }

    // PUT /api/habits/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, HabitCreateDto dto)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var existing = await _habitService.GetByIdAsync(id);
        if (existing == null || existing.OwnerId != userId) return NotFound();

        existing.Name = dto.Name;
        existing.Description = dto.Description;
        existing.Difficulty = dto.Difficulty;
        existing.ResetCounter = dto.ResetCounter;
        existing.Value = dto.Value;

        await _habitService.UpdateAsync(id, existing);
        return NoContent();
    }

    // DELETE /api/habits/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var existing = await _habitService.GetByIdAsync(id);
        if (existing == null || existing.OwnerId != userId) return NotFound();

        await _habitService.DeleteAsync(id);
        return NoContent();
    }
}
