import { NumRange } from "./num-range";

const range: NumRange = NumRange.fromString("(1,2]");
describe(range.toString(), () => {
    it('constructs correctly', () => {
        expect(range.lowerBound).toEqual(1);
        expect(range.upperBound).toEqual(2);
        expect(range.lowerInc()).toBe(false);
        expect(range.upperInc()).toBe(true);
        expect(range.toString()).toEqual("(1,2]");
    });

    const equals: NumRange = NumRange.fromString("(1,2]");
    const notExtLeftOf = [
        NumRange.fromString("(1,2]"),
        NumRange.fromString("[1,2]"),
        NumRange.fromString("(0,2]"),
        NumRange.fromString("(,2)"),
    ];
    const notExtRightOf = [
        NumRange.fromString("(1,2]"),
        NumRange.fromString("(1,3)"),
        NumRange.fromString("(1,)"),
    ];
    const containsRange = [
        NumRange.fromString("(1,2]"),
        NumRange.fromString("(1,2)"),
        NumRange.fromString("(1.1,1.2)"),
    ];
    const notContainsRange = [
        NumRange.fromString("(1,2.1]"),
        NumRange.fromString("[1,2)"),
        NumRange.fromString("(,)"),
        NumRange.fromString("empty"),
    ];
    const containsPoint = [1.1, 2];
    const notContainsPoint = [0, 1, 2.1, NaN];
    const overlaps = [
        NumRange.fromString("[2,3)"),
        NumRange.fromString("(,)"),
    ];
    const notOverlaps = [
        NumRange.fromString("empty"),
    ];
    const strictlyLeftOf = [
        NumRange.fromString("(2,3)"),
        NumRange.fromString("(3,4)"),
        NumRange.fromString("(3,)"),
    ];
    const notStrictlyLeftOf = [
        NumRange.fromString("(0,0)"),
        NumRange.fromString("[2,2]"),
        NumRange.fromString("(,)"),
        NumRange.fromString("empty")
    ];
    const strictlyRightOf = [
        NumRange.fromString("(,1]"),
        NumRange.fromString("(0,0)"),
    ];
    const notStrictlyRightOf = [
        NumRange.fromString("(2,3)"),
        NumRange.fromString("(0,1.1)"),
        NumRange.fromString("(,)"),
    ];
    const adjacentTo = [
        NumRange.fromString("(2,3)"),
        NumRange.fromString("(,1]"),
    ];
    const notAdjacentTo = [
        NumRange.fromString("(,1)"),
        NumRange.fromString("[2,3)"),
        NumRange.fromString("empty"),
        NumRange.fromString("(1,3)"),
        NumRange.fromString("(,2]"),
    ];

    const union = [
        [NumRange.fromString("(0,3)"), NumRange.fromString("(1,3)")],
        [NumRange.fromString("(,1]"), NumRange.fromString("(,2]")],
        [NumRange.fromString("(0,1]"), NumRange.fromString("(0,2]")],
        [NumRange.fromString("empty"), NumRange.fromString("(1,2]")],
    ];

    const intersection = [
        [NumRange.fromString("(0,1]"), NumRange.fromString("(1,1]")],
        [NumRange.fromString("(,)"), NumRange.fromString("(1,2]")],
        [NumRange.fromString("empty"), NumRange.fromString("(1,2]")],
    ];

    const difference = [
        [NumRange.fromString("(0,1.5]"), NumRange.fromString("(1.5,2]")],
        // [NumRange.fromString("[0,1.5)"), NumRange.fromString("[1.5,2]")],
        [NumRange.fromString("(1,2]"), NumRange.fromString("(1,2]")],
        [NumRange.fromString("(0,0)"), NumRange.fromString("empty")],
    ];

    it(`equals ${equals}`, () => expect(range.equals(equals)).toBe(true));
    notExtLeftOf.forEach(r => it(`does not extend left of ${r}`, () => expect(range.notExtLeftOf(r)).toBe(true)));
    notExtRightOf.forEach(r => it(`does not extend right of ${r}`, () => expect(range.notExtRightOf(r)).toBe(true)));
    containsRange.forEach(r => it(`contains ${r}`, () => expect(range.containsRange(r)).toBe(true)));
    notContainsRange.forEach(r => it(`does not contain ${r}`, () => expect(range.containsRange(r)).toBe(false)));
    containsPoint.forEach(p => it(`contains ${p}`, () => expect(range.containsPoint(p)).toBe(true)));
    notContainsPoint.forEach(p => it(`does not contain ${p}`, () => expect(range.containsPoint(p)).toBe(false)));
    overlaps.forEach(r => it(`overlaps ${r}`, () => expect(range.overlaps(r)).toBe(true)));
    notOverlaps.forEach(r => it(`not overlaps ${r}`, () => expect(range.overlaps(r)).toBe(false)));
    strictlyLeftOf.forEach(r => it(`is strictly left of ${r}`, () => expect(range.strictlyLeftOf(r)).toBe(true)));
    notStrictlyLeftOf.forEach(r => it(`is not strictly left of ${r}`, () => expect(range.strictlyLeftOf(r)).toBe(false)));
    strictlyRightOf.forEach(r => it(`is strictly right of ${r}`, () => expect(range.strictlyRightOf(r)).toBe(true)));
    notStrictlyRightOf.forEach(r => it(`is not strictly right of ${r}`, () => expect(range.strictlyRightOf(r)).toBe(false)));
    adjacentTo.forEach(r => it(`is adjacent to ${r}`, () => expect(range.adjacentTo(r)).toBe(true)));
    notAdjacentTo.forEach(r => it(`is not adjecent to ${r}`, () => expect(range.adjacentTo(r)).toBe(false)));

    union.forEach(arr => {
        const r2 = arr[0];
        const u = arr[1];
        it(`union ${r2} is ${u}`, () => {
            range.union(r2).equals(u);
        });
    });

    intersection.forEach(arr => {
        const r2 = arr[0];
        const i = arr[1];
        it(`intersection ${r2} is ${i}`, () => {
            range.union(r2).equals(i);
        });
    });

    difference.forEach(arr => {
        const r2 = arr[0];
        const d = arr[1];
        it(`difference ${r2} is ${d}`, () => {
            range.difference(r2);
        });
    });
});

const invalidRanges = ["", "foo", "(,", "(1,0)"];
invalidRanges.forEach(str => {
    expect(() => {NumRange.fromString(str)}).toThrow(Error);
});