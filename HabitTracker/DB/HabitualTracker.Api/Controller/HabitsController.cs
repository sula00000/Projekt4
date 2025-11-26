using HabitualTracker.Api.Models;
using HabitualTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HabitualTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HabitsController : ControllerBase
{
    private readonly HabitService _habitService;

    public HabitsController(HabitService habitService)
    {
        _habitService = habitService;
    }

    // GET /api/habits
    [HttpGet]
    public async Task<ActionResult<List<Habit>>> GetAll()
    {
        var habits = await _habitService.GetAllAsync();
        return Ok(habits);
    }

    // GET /api/habits/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Habit>> GetById(string id)
    {
        var habit = await _habitService.GetByIdAsync(id);
        if (habit == null) return NotFound();
        return Ok(habit);
    }

    // POST /api/habits
    [HttpPost]
    public async Task<ActionResult<Habit>> Create(HabitCreateDto dto)
    {
        var habit = new Habit
        {
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
        var existing = await _habitService.GetByIdAsync(id);
        if (existing == null) return NotFound();

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
        var existing = await _habitService.GetByIdAsync(id);
        if (existing == null) return NotFound();

        await _habitService.DeleteAsync(id);
        return NoContent();
    }
}
