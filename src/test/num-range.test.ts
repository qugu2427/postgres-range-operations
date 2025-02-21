import { NumRange } from "../num-range";
import { Range } from "../range";

const range: NumRange = NumRange.fromString("(1,2]");
describe(range.toString(), () => {
    it('constructs correctly', () => {
        expect(range.lowerBound).toEqual(1);
        expect(range.upperBound).toEqual(2);
        expect(range.lowerInc()).toBe(false);
        expect(range.upperInc()).toBe(true);
        expect(range.toString()).toEqual("(1,2]");
        expect(range.lower()).toBe(1);
        expect(range.upper()).toBe(2);
        expect(range.lowerInf()).toBe(false);
        expect(range.upperInf()).toBe(false);
    });

    const equals: NumRange = NumRange.fromString("(1,2]");
    const notEquals = [
        NumRange.fromString("(1,2)"),
        NumRange.fromString("(0,2]"),
        NumRange.fromString("empty"),
        NumRange.fromString("(,)"),
    ];
    const notExtLeftOf = [
        NumRange.fromString("(1,2]"),
        NumRange.fromString("[1,2]"),
        NumRange.fromString("(0,2]"),
        NumRange.fromString("(,2)"),
        NumRange.fromString("[0,0]"),
    ];
    const extLeftOf = [
        NumRange.fromString("(1.1,2]"),
        NumRange.fromString("empty") // ranges technically extend left and right of empty
    ];
    const notExtRightOf = [
        NumRange.fromString("(1,2]"),
        NumRange.fromString("(1,3)"),
        NumRange.fromString("(1,)"),
        NumRange.fromString("[2.1,2.1]"),
    ];
    const extRightOf = [
        NumRange.fromString("(1,2)"),
        NumRange.fromString("empty"),
    ];
    const containsRange = [
        NumRange.fromString("(1,2]"),
        NumRange.fromString("(1,2)"),
        NumRange.fromString("(1.1,1.2)"),
        NumRange.fromString("empty"),
    ];
    const notContainsRange = [
        NumRange.fromString("(1,2.1]"),
        NumRange.fromString("[1,2)"),
        NumRange.fromString("(,)"),
    ];
    const containsPoint = [1.1, 2];
    const notContainsPoint = [0, 1, 2.1, NaN];
    const overlaps = [
        NumRange.fromString("[2,3)"),
        NumRange.fromString("(,)"),
    ];
    const notOverlaps = [
        NumRange.fromString("empty"),
        NumRange.fromString("(3,4]"),
        NumRange.fromString("[0,1)"),
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
    ];
    const notStrictlyRightOf = [
        NumRange.fromString("(2,3)"),
        NumRange.fromString("(0,1.1)"),
        NumRange.fromString("(,)"),
        NumRange.fromString("(0,0)"),
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
        [NumRange.fromString("(0,3)"), NumRange.fromString("(0,3)")],
        [NumRange.fromString("(,1]"), NumRange.fromString("(,2]")],
        [NumRange.fromString("(0,1]"), NumRange.fromString("(0,2]")],
        [NumRange.fromString("empty"), NumRange.fromString("(1,2]")],
        [NumRange.fromString("(,)"), NumRange.fromString("(,)")],
        [NumRange.fromString("(1.1,3)"), NumRange.fromString("(1,3)")],
        [NumRange.fromString("(0,1]"), NumRange.fromString("(0,2]")],
        [NumRange.fromString("(2,3)"), NumRange.fromString("(1,3)")],
        [NumRange.fromString("(1,2]"), NumRange.fromString("(1,2]")],
    ];
    const unionErr = [
        NumRange.fromString("(3,4)"),
    ]

    const intersection = [
        [NumRange.fromString("(0,1]"), NumRange.fromString("empty")],
        [NumRange.fromString("(,)"), NumRange.fromString("(1,2]")],
        [NumRange.fromString("empty"), NumRange.fromString("empty")],
        [NumRange.fromString("(1,2]"), NumRange.fromString("(1,2]")],
        [NumRange.fromString("(1,2)"), NumRange.fromString("(1,2)")],
        [NumRange.fromString("(1,1.1)"), NumRange.fromString("(1,1.1)")],
        [NumRange.fromString("(1.1,2)"), NumRange.fromString("(1.1,2)")],
    ];

    const difference = [
        [NumRange.fromString("empty"), NumRange.fromString("(1,2]")],
        [NumRange.fromString("(3,)"), NumRange.fromString("(1,2]")],
        [NumRange.fromString("(0,1.5]"), NumRange.fromString("(1.5,2]")],
        [NumRange.fromString("(0,1.5)"), NumRange.fromString("[1.5,2]")],
        [NumRange.fromString("(1.5,3)"), NumRange.fromString("(1,1.5]")],
        [NumRange.fromString("[1.5,3)"), NumRange.fromString("(1,1.5)")],
        [NumRange.fromString("(1,2]"), NumRange.fromString("empty")],
    ];
    const differenceErr = [
        NumRange.fromString("(0,100)"),
        NumRange.fromString("(1.1,1.3)"),
    ];

    it(`equals ${equals}`, () => expect(range.equals(equals)).toBe(true));
    notEquals.forEach(r => it(`does not equal ${r}`, () => expect(range.equals(r)).toBe(false)));
    notExtLeftOf.forEach(r => it(`does not extend left of ${r}`, () => expect(range.notExtLeftOf(r)).toBe(true)));
    extLeftOf.forEach(r => it(`extends left of ${r}`, () => expect(range.notExtLeftOf(r)).toBe(false)));
    notExtRightOf.forEach(r => it(`does not extend right of ${r}`, () => expect(range.notExtRightOf(r)).toBe(true)));
    extRightOf.forEach(r => it(`extends right of ${r}`, () => expect(range.notExtRightOf(r)).toBe(false)));
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
    notAdjacentTo.forEach(r => it(`is not adjacent to ${r}`, () => expect(range.adjacentTo(r)).toBe(false)));

    union.forEach(arr => {
        const r2 = arr[0];
        const u = arr[1];
        it(`union ${r2} is ${u}`, () => {
            expect(range.union(r2).equals(u)).toBe(true);
        });
    });
    unionErr.forEach(r => expect(() => {range.union(r)}).toThrow(Error));

    intersection.forEach(arr => {
        const r2 = arr[0];
        const i = arr[1];
        it(`intersection ${r2} is ${i}`, () => {
            expect(range.intersection(r2).equals(i)).toBe(true);
        });
    });

    difference.forEach(arr => {
        const r2 = arr[0];
        const d = arr[1];
        it(`difference ${r2} is ${d}`, () => {
            expect(range.difference(r2).equals(d)).toBe(true);
        });
    });
    differenceErr.forEach(r => expect(() => {range.difference(r)}).toThrow(Error));
});

const emptyRange: NumRange = NumRange.fromString("empty");
describe(`${emptyRange}`, () => {
    it('constructs correctly', () => {
        expect(emptyRange.lowerBound).toBeNaN();
        expect(emptyRange.upperBound).toBeNaN();
        expect(emptyRange.lowerInc()).toBe(false);
        expect(emptyRange.upperInc()).toBe(false);
        expect(emptyRange.toString()).toEqual("empty");
    });
    const emptyRange2: NumRange = emptyRange.getEmptyRange();
    it(`equals ${emptyRange}`, () => expect(emptyRange.equals(emptyRange2)).toBe(true));
    it(`union empty is empty`, () => expect(emptyRange.union(emptyRange.getEmptyRange()).isEmpty()).toBe(true));
    const infRange: NumRange = NumRange.fromString("(,)");
    it(`union ${infRange} is ${infRange}`, () => expect(emptyRange.union(infRange).equals(infRange)).toBe(true));
    it(`does not contain [1,1]`, () => expect(emptyRange.containsRange(NumRange.fromString("[1,1]"))).toBe(false));
    it(`does contain empty`, () => expect(emptyRange.containsRange(NumRange.fromString("empty"))).toBe(true));
});


const invalidRanges = ["", "foo", "(,", "(1,0)", "[,]"];
invalidRanges.forEach(str => {
    describe(`invalid range '${str}'` , () => {
        it(`errors during construction`, () => {
            expect(() => {NumRange.fromString(str)}).toThrow(Error);
        });
    });
});

const rangeDirect: NumRange = new NumRange(1,2, Range.FLAG_LOWER_INC | Range.FLAG_UPPER_INC);
describe(rangeDirect.toString(), () => {
    it('constructs correctly', () => {
        expect(rangeDirect.toString()).toEqual("[1,2]");
    });
});