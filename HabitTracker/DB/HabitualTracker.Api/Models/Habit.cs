using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace HabitualTracker.Api.models
{
    public class Habit
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        [BsonElement("name")]
        public string Name { get; set; } = null!;

        [BsonElement("description")]
        public string Description { get; set; } = null!;

        [BsonElement("difficulty")]
        public string Difficulty { get; set; } = null!;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("isCompleted")]
        public bool IsCompleted { get; set; }
    }
}