namespace HabitualTracker.Api.Models;

public class HabitDatabaseSetting
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string HabitCollectionName { get; set; } = null!;
}