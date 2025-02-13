import { IntRange } from "./int-range";

const range: IntRange = IntRange.fromString("(1.2,2.35]");
describe(range.toString(), () => {
    it('constructs correctly', () => {
        expect(range.lowerBound).toEqual(1);
        expect(range.upperBound).toEqual(2);
        expect(range.lowerInc()).toBe(false);
        expect(range.upperInc()).toBe(true);
        expect(range.toString()).toEqual("(1,2]");
    });
});