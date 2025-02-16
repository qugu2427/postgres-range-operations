import { Range } from "pgrange/lib/range";

export class NumRange extends Range<number> {

    constructor(lowerBound: number, upperBound: number, flags = 0) {
        super(lowerBound, upperBound, flags, x => x, x => x);
    }

    static fromString(rangeStr: string): NumRange {
        if (rangeStr === 'empty') {
            return new NumRange(NaN, NaN, Range.FLAG_EMPTY);
        }

        if (!Range.DEFAULT_RANGE_RGX.test(rangeStr)) {
            throw new Error("invalid range format");
        }

        let flags: number = 0;
        if (rangeStr[0] === '[') {
            flags |= Range.FLAG_LOWER_INC;
        }
        if (rangeStr[rangeStr.length - 1] === ']') {
            flags |= Range.FLAG_UPPER_INC;
        }
        const commaIndex: number = rangeStr.indexOf(',');
        const lowerBoundStr: string = rangeStr.substring(1, commaIndex);
        const upperBoundStr: string = rangeStr.substring(commaIndex + 1, rangeStr.length - 1);

        const lowerBound: number = lowerBoundStr === "" ? -Infinity : Number(lowerBoundStr);
        const upperBound: number = upperBoundStr === "" ? Infinity : Number(upperBoundStr);

        if (isNaN(lowerBound) || isNaN(upperBound)) {
            throw new Error("NaN not allowed in range");
        }

        return new NumRange(lowerBound, upperBound, flags);
    }
}
