import { Range } from "./range";

export class NumRange extends Range<number> {

    constructor(lowerBound: number, upperBound: number, flags: number) {
        super(lowerBound, upperBound, flags, x => x, x => x);
    }

    static fromString(rangeStr: string): NumRange {
        if (rangeStr === 'empty') {
            return new NumRange(NaN, NaN, Range.FLAG_EMPTY);
        }

        if (!Range.DEFAULT_RANGE_RGX.test(rangeStr)) {
            throw new Error("invalid range format");
        }

        var flags: number = 0;
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
        } else if (
            lowerBound === -Infinity && ((flags & Range.FLAG_LOWER_INC) != 0) ||
            upperBound === Infinity && ((flags & Range.FLAG_UPPER_INC) != 0)
        ) {
            throw new Error("infinite bounds cannot be closed");
        } else if (lowerBound === Infinity) {
            throw new Error("lower bound cannot be infinity")
        } else if (upperBound === -Infinity) {
            throw new Error("upper bound cannot be negative infinity")
        } else if (
            upperBound === lowerBound && 
            !(flags & Range.FLAG_LOWER_INC) !== !(flags & Range.FLAG_UPPER_INC)
        ) {
            return new NumRange(NaN, NaN, Range.FLAG_EMPTY);
        }

        return new NumRange(lowerBound, upperBound, flags);
    }
}