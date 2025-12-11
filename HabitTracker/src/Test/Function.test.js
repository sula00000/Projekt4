import {describe, expect, test} from 'vitest';
import {clampDifficulty} from '../../src/Services/HabitEdit.jsx';

// i want to import from services/Scheduler.jsx
describe("function_clampDifficulty", () => {
    test("skal retunere 3 hvis input er invalid eller empty",() => {
        expect(clampDifficulty("")).toBe(3);
        expect(clampDifficulty(undefined)).toBe(3);
        expect(clampDifficulty(null)).toBe(3);
    })
});