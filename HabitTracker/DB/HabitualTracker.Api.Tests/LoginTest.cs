using HabitualTracker.Api.Models;

using NUnit.Framework;

namespace HabitualTracker.Api.Tests;

public class LoginTests
{
    [Test]
    public void Login_Email_ShouldNotBeEmpty()
    {
        // Arrange
        var login = new Login
        {
            Email = "test@abc.com",
            Password = "test123"
        };

        // Act
        // (ingen handling - vi tester kun initialisering)

        // Assert
        Assert.That(login.Email, Is.Not.Empty, "Email må ikke være tom i normal brug");
    }


    // BVA-test: Password kan ændres og gemmes
    [Test]
    public void Login_Password_ShouldUpdateCorrectly()
    {
        var login = new Login
        {
            Email = "test@abc.com",
            Password = "oldPass"
        };

        login.Password = "newPass";

        Assert.That(login.Password, Is.EqualTo("newPass"));
    }

    // White-box test: Model kan oprettes
    [Test]
    public void Login_Model_CreatesCorrectly()
    {
        var login = new Login
        {
            Email = "user@test.com",
            Password = "1234"
        };

        Assert.That(login.Email, Is.EqualTo("user@test.com"));
        Assert.That(login.Password, Is.EqualTo("1234"));
    }
}
