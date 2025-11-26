namespace HabitualTracker.Api.Models;

public class HabitCreateDto
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = "";
    public int Difficulty { get; set; } = 3;
    public string ResetCounter { get; set; } = "daily";
    public int Value { get; set; } = 0;
}
