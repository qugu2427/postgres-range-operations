import { Range } from "./range";
import { format } from 'date-fns';

export class DateRange extends Range<Date> {

    private static readonly maxDate = new Date(8640000000000000);
    private static readonly minDate = new Date(-8640000000000000);
    private static readonly nanDate = new Date(NaN);

    private format: string;

    constructor(lowerBound: Date, upperBound: Date, flags: number, format="MM-dd-yyyy") {
        super(lowerBound, upperBound, flags, DateRange.valToNum, DateRange.numToVal);
        this.format = format;
    }

    private static valToNum(date: Date): number {
        if (date.getTime() === DateRange.maxDate.getTime()) {
            return Infinity;
        } else if (date.getTime() === DateRange.minDate.getTime()) {
            return -Infinity;
        }
        return date.getTime();
    }

    private static numToVal(number: number): Date {
        if (number === Infinity) {
            return new Date(DateRange.maxDate.getTime());
        } else if (number === -Infinity) {
            return new Date(DateRange.minDate.getTime());
        }
        return new Date(number);
    }

    static fromString(rangeStr: string): DateRange {
        if (rangeStr === 'empty') {
            return new DateRange(this.nanDate, this.nanDate, Range.FLAG_EMPTY);
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

        const lowerBound = lowerBoundStr === "" ? new Date(DateRange.minDate.getTime()) : new Date(lowerBoundStr);
        const upperBound = upperBoundStr === "" ? new Date(DateRange.maxDate.getTime()) : new Date(upperBoundStr);

        if (isNaN(lowerBound.getTime()) || isNaN(upperBound.getTime())) {
            throw new Error("NaN date not allowed in range " + lowerBound);
        }

        return new DateRange(lowerBound, upperBound, flags);
    }

    toString(): string {
        if (this.isEmpty()) {
            return 'empty';
        }
        const incLowerBound = this.lowerInc() ? '[' : '(';
        const incUpperBound = this.upperInc() ? ']' : ')';
        return `${incLowerBound}${format(this.numToVal(this.lowerBound), this.format)},${format(this.numToVal(this.upperBound), this.format)}${incUpperBound}`;
    }
}
