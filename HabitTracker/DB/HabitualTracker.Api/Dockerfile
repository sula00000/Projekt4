# Base image til at køre app'en
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Kopiér csproj og restore
COPY HabitualTracker.Api.csproj ./
RUN dotnet restore

# Kopiér resten af koden og byg
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Final image
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

# .NET app lytter på port 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "HabitualTracker.Api.dll"]
