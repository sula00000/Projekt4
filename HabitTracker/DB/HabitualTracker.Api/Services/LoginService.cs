using HabitualTracker.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace HabitualTracker.Api.Services;

public class LoginService
{
    private readonly IMongoCollection<Login> _logins;

    public LoginService(IOptions<HabitDatabaseSetting> options)
    {
        var settings = options.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);

        _logins = database.GetCollection<Login>("Login"); // collection-navn
    }

    public async Task<Login?> GetByEmailAsync(string email) =>
        await _logins.Find(u => u.Email == email).FirstOrDefaultAsync();

    public async Task<Login> CreateAsync(Login login)
    {
        await _logins.InsertOneAsync(login);
        return login;
    }
}
