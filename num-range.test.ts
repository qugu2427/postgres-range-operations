import { NumRange } from "./num-range";

// test('(1,2] constructs correctly', () => {
//     const range: NumRange = NumRange.fromString("(1,2]");
//     expect(range.getLowerBound()).toEqual(1);
//     expect(range.getUpperBound()).toEqual(2);
//     expect(range.hasClosedLowerBound()).toBe(false);
//     expect(range.hasClosedUpperBound()).toBe(true);
//     expect(range.toString()).toEqual("(1,2]");
// });

// test('(-Infinity,Infinity) constructs correctly', () => {
//     const range: NumRange = NumRange.fromString("(-Infinity,Infinity)");
//     expect(range.getLowerBound()).toEqual(-Infinity);
//     expect(range.getUpperBound()).toEqual(Infinity);
//     expect(range.hasClosedLowerBound()).toBe(false);
//     expect(range.hasClosedUpperBound()).toBe(false);
//     expect(range.toString()).toEqual("(-Infinity,Infinity)");
// });

// test('(,) constructs correctly', () => {
//     const range: NumRange = NumRange.fromString("(,)");
//     expect(range.getLowerBound()).toEqual(-Infinity);
//     expect(range.getUpperBound()).toEqual(Infinity);
//     expect(range.hasClosedLowerBound()).toBe(false);
//     expect(range.hasClosedUpperBound()).toBe(false);
//     expect(range.toString()).toEqual("(-Infinity,Infinity)");
// });

// test('empty constructs correctly', () => {
//     const range: NumRange = NumRange.fromString("empty");
//     expect(range.getLowerBound()).toEqual(NaN);
//     expect(range.getUpperBound()).toEqual(NaN);
//     expect(range.hasClosedLowerBound()).toBe(false);
//     expect(range.hasClosedUpperBound()).toBe(false);
//     expect(range.toString()).toEqual("empty");
// });

describe('(1,2]', () => {
    const range: NumRange = NumRange.fromString("(1,2]");
    it('constructs correctly', () => {
        expect(range.getLowerBound()).toEqual(1);
        expect(range.getUpperBound()).toEqual(2);
        expect(range.hasClosedLowerBound()).toBe(false);
        expect(range.hasClosedUpperBound()).toBe(true);
        expect(range.toString()).toEqual("(1,2]");
    });
    it('equals (1,2]', () => {
        const copy: NumRange = NumRange.fromString("(1,2]");
        expect(range.eq(copy)).toBe(true);
        expect(copy.eq(range)).toBe(true);
    });
    it('does not equal (1,3]', () => {
        expect(range.eq(NumRange.fromString("(1,3]"))).toBe(false);
    });
    it('is less than (1.1,1.2]', () => {
        expect(range.lt(NumRange.fromString("(1.1,1.2]"))).toBe(true);
    });
    it('is not less than (0.9,1.2]', () => {
        expect(range.lt(NumRange.fromString("(0.9,1.2]"))).toBe(false);
    });
    it('is less than or equal to (1,1.2]', () => {
        expect(range.le(NumRange.fromString("(1,1.2]"))).toBe(true);
    });
    it('is not less than or equal to (0.9,1.2]', () => {
        expect(range.le(NumRange.fromString("(0.9,1.2]"))).toBe(false);
    });
});

