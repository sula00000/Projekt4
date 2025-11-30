using HabitualTracker.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace HabitualTracker.Api.Services;

public class HabitService
{
    private readonly IMongoCollection<Habit> _habits;

    public HabitService(IOptions<HabitDatabaseSetting> options)
    {
        var settings = options.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _habits = database.GetCollection<Habit>(settings.HabitCollectionName);
    }

    public async Task<List<Habit>> GetAllAsync() =>
        await _habits.Find(_ => true).ToListAsync();

    public async Task<Habit?> GetByIdAsync(string id) =>
        await _habits.Find(h => h.Id == id).FirstOrDefaultAsync();
    public async Task<List<Habit>> GetByOwnerAsync(string ownerId) =>
        await _habits.Find(h => h.OwnerId == ownerId).ToListAsync();


    public async Task<Habit> CreateAsync(Habit habit)
    {
        await _habits.InsertOneAsync(habit);
        return habit;
    }

    public async Task UpdateAsync(string id, Habit habitIn) =>
        await _habits.ReplaceOneAsync(h => h.Id == id, habitIn);

    public async Task DeleteAsync(string id) =>
        await _habits.DeleteOneAsync(h => h.Id == id);
}
