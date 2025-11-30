using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HabitualTracker.Api.Models;

public class Login
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("email")]
    public string Email { get; set; } = null!;

    [BsonElement("password")]
    public string Password { get; set; } = null!;
}
