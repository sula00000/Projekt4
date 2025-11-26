using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HabitualTracker.Api.Models;

public class Habit
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }    // ingen default-værdi, ingen "string

    [BsonElement("name")]
    public string Name { get; set; } = null!;

    [BsonElement("description")]
    public string Description { get; set; } = "";

    [BsonElement("difficulty")]
    public int Difficulty { get; set; } = 3;

    [BsonElement("resetCounter")]
    public string ResetCounter { get; set; } = "daily";

    [BsonElement("value")]
    public int Value { get; set; } = 0;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
