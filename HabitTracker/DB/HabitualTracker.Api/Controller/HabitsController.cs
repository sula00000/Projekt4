using System.IdentityModel.Tokens.Jwt;
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
        // vi lagde brugerens Id i "sub" claim i JWT
        return User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
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
