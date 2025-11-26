using HabitualTracker.Api.Models;
using HabitualTracker.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// MongoDB settings
builder.Services.Configure<HabitDatabaseSetting>(
    builder.Configuration.GetSection("HabitDatabaseSetting"));

// Habit service
builder.Services.AddSingleton<HabitService>();

builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
