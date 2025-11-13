//Funktioner til at hente, tilføje, redigere og slette habits + opdatere +/−.
export default class Habit {
  constructor(id, name, description, difficulty = 3, resetCounter = "daily") {
    this.id = id;
    this.name = name || "";
    this.description = description || "";
    const d = Number(difficulty) || 3;
    this.difficulty = Math.min(5, Math.max(1, Math.floor(d)));
    this.resetCounter = resetCounter || "daily";
    this.value = 0;
    this.createdAt = new Date().toISOString();
  }
}
