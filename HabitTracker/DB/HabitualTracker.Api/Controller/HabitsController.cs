// her laver vi vores endpoints

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
    public async Task<ActionResult<Habit>> Create(Habit habit)
    {
        await _habitService.CreateAsync(habit);
        return CreatedAtAction(nameof(GetById), new { id = habit.Id }, habit);
    }

    // PUT /api/habits/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Habit habit)
    {
        var existing = await _habitService.GetByIdAsync(id);
        if (existing == null) return NotFound();

        habit.Id = id;
        await _habitService.UpdateAsync(id, habit);
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
