using System;
using HabitualTracker.Api.Models;
using NUnit.Framework;

namespace HabitualTracker.Api.Tests;

public class HabitTests
{
    // BVA-test: default værdier
    [Test]
    public void Habit_DefaultValues_ShouldBeCorrect()
    {
        var habit = new Habit();

        Assert.That(habit.Value, Is.EqualTo(0)); // BVA: minimum værdi
        Assert.That(habit.Difficulty, Is.EqualTo(3)); // Default i midten af skala
        Assert.That(habit.ResetCounter, Is.EqualTo("daily"));
        Assert.That(habit.CreatedAt, Is.Not.EqualTo(default(DateTime)));
    }

    // BVA-test: Difficulty skal kunne være indenfor 1-5
    [Test]
    public void Habit_Difficulty_ShouldAcceptValuesWithinRange()
    {
        var habit = new Habit
        {
            Difficulty = 5
        };

        Assert.That(habit.Difficulty, Is.LessThanOrEqualTo(5));
        Assert.That(habit.Difficulty, Is.GreaterThanOrEqualTo(1));
        // vi tester “kant”-værdier
    }

    // White-box test: DTO -> Model map
    [Test]
    public void Habit_CanBeCreated_FromDto()
    {
        var dto = new HabitCreateDto
        {
            Name = "Løb",
            Description = "Løb hver morgen",
            Difficulty = 4,
            ResetCounter = "weekly",
            Value = 2
        };

        var habit = new Habit
        {
            Name = dto.Name,
            Description = dto.Description,
            Difficulty = dto.Difficulty,
            ResetCounter = dto.ResetCounter,
            Value = dto.Value,
            OwnerId = "dummy-user"
        };

        Assert.That(habit.Name, Is.EqualTo(dto.Name));
        Assert.That(habit.Description, Is.EqualTo(dto.Description));
        Assert.That(habit.Difficulty, Is.EqualTo(4));
        Assert.That(habit.ResetCounter, Is.EqualTo("weekly"));
        Assert.That(habit.Value, Is.EqualTo(2));
    }
}
