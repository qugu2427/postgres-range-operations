type RangeFlag = number;

export class Range<T> {
    protected static readonly DEFAULT_RANGE_RGX: RegExp = /^.+$/;

    static readonly FLAG_EMPTY: RangeFlag = 0b100
    static readonly FLAG_LOWER_INC: RangeFlag = 0b010;
    static readonly FLAG_UPPER_INC: RangeFlag = 0b001;

    flags = 0;
    lowerBound: number;
    upperBound: number;
    valToNum: (val: T) => number;
    numToVal: (num: number) => T;

    constructor(
        lowerBound: T,
        upperBound: T,
        flags: number,
        valToNum: (val: T) => number,
        numToVal: (num: number) => T
    ) {
        this.valToNum = valToNum;
        this.numToVal = numToVal;
        this.lowerBound = valToNum(lowerBound);
        this.upperBound = valToNum(upperBound);
        if (this.lowerBound > this.upperBound) {
            throw new Error("lower bound greater than upper bound")
        }
        this.flags = flags;
    }

    private hasFlag(flag: number): boolean {
        return (this.flags & flag) != 0;
    }

    /**
     * get a new empty range object
     */
    getEmptyRange(): Range<T> {
        return new Range<T>(
            this.numToVal(NaN),
            this.numToVal(NaN),
            Range.FLAG_EMPTY,
            this.valToNum,
            this.numToVal
        );
    }

    /**
     * equivalent of postgres 'upper_inc()' function
     */
    lowerInc(): boolean {
        return this.hasFlag(Range.FLAG_LOWER_INC);
    }

    /**
     * equivalent of postgres 'upper_inc()' function
     */
    upperInc(): boolean {
        return this.hasFlag(Range.FLAG_UPPER_INC);
    }

    /**
     * equivalent of postgres 'isempty()' function
     */
    isEmpty(): boolean {
        return this.hasFlag(Range.FLAG_EMPTY);
    }

    /**
     * equals range
     *
     * equivalent of postgres '=' operator for a range
     */
    equals(range: Range<T>): boolean {
        if (this.isEmpty() && range.isEmpty()) {
            return true;
        }
        return this.lowerBound === range.lowerBound &&
            this.upperBound === range.upperBound &&
            this.flags === range.flags;
    }

    /**
     * does not extend left of range
     *
     * equivalent of postgres '&>' operator for a range
     */
    notExtLeftOf(range: Range<T>): boolean {
        if (this.lowerBound === range.lowerBound) {
            return this.lowerInc() === range.lowerInc() ||
                !this.lowerInc();
        }
        return this.lowerBound > range.lowerBound;
    }

    /**
     * does not extend right of range
     *
     * equivalent of postgres '&<' operator for a range
     */
    notExtRightOf(range: Range<T>): boolean {
        if (this.upperBound === range.upperBound) {
            return this.upperInc() === range.upperInc() ||
                !this.upperInc();
        }
        return this.upperBound < range.upperBound;
    }

    /**
     * contains range
     *
     * equivalent of postgres '@>' operator for a range
     */
    containsRange(range: Range<T>): boolean {
        return range.isEmpty() || (range.notExtLeftOf(this) && range.notExtRightOf(this));
    }

    /**
     * contains point
     *
     * equivalent of postgres '@>' operator for a single element
     */
    containsPoint(point: T): boolean {
        const p: number = this.valToNum(point);
        return (p > this.lowerBound && p < this.upperBound) ||
            (p === this.lowerBound && this.lowerInc()) ||
            (p === this.upperBound && this.upperInc());
    }

    /**
     * overlaps range
     *
     * equivalent of postgres '&&' operator
     */
    overlaps(range: Range<T>): boolean {
        return !(
            this.strictlyLeftOf(range) ||
            this.strictlyRightOf(range) ||
            this.isEmpty() ||
            range.isEmpty()
        );
    }

    /**
     * strictly left of range
     *
     * equivalent of postgres '<<' operator
     */
    strictlyLeftOf(range: Range<T>): boolean {
        if (this.upperBound === range.lowerBound) {
            return !this.upperInc() || !range.lowerInc();
        }
        return this.upperBound < range.lowerBound;
    }

    /**
     * strictly right of range
     *
     * equivalent of postgres '>>' operator
     */
    strictlyRightOf(range: Range<T>): boolean {
        if (this.lowerBound === range.upperBound) {
            return !this.lowerInc() || !range.upperInc();
        }
        return this.lowerBound > range.upperBound;
    }

    /**
     * adjacent with range
     *
     * equivalent of postgres '-|-' operator
     */
    adjacentTo(range: Range<T>): boolean {
        if (this.upperBound === range.lowerBound) {
            return this.upperInc() !== range.lowerInc();
        } else if (this.lowerBound === range.upperBound) {
            return this.lowerInc() !== range.upperInc();
        }
        return false;
    }

    /**
     * calculates union with range
     *
     * equivalent of postgres '+' operator
     */
    union(range: Range<T>): Range<T> {
        let lowerBound: number;
        let upperBound: number;
        let flags: number = 0;

        if (this.isEmpty() && range.isEmpty()) {
            return this.getEmptyRange();
        } else if (range.isEmpty()) {
            return this.copy();
        } else if (this.isEmpty()) {
            return range.copy();
        }

        if (!(this.overlaps(range) || range.adjacentTo(this))) {
            throw new Error("cannot union non-overlapping or non-adjacent ranges")
        }

        if (this.lowerBound < range.lowerBound) {
            lowerBound = this.lowerBound;
            flags |= Range.FLAG_LOWER_INC & this.flags;
        } else if (this.lowerBound > range.lowerBound) {
            lowerBound = range.lowerBound;
            flags |= Range.FLAG_LOWER_INC & range.flags;
        } else {
            lowerBound = this.lowerBound;
            flags |= Range.FLAG_LOWER_INC & (this.flags | range.flags);
        }

        if (this.upperBound > range.upperBound) {
            upperBound = this.upperBound;
            flags |= Range.FLAG_UPPER_INC & this.flags;
        } else if (this.upperBound < range.upperBound) {
            upperBound = range.upperBound;
            flags |= Range.FLAG_UPPER_INC & range.flags;
        } else {
            upperBound = this.upperBound;
            flags |= Range.FLAG_UPPER_INC & (range.flags | this.flags);
        }

        return new Range<T>(this.numToVal(lowerBound), this.numToVal(upperBound), flags, this.valToNum, this.numToVal);
    }

    /**
     * calculates intersection with range
     *
     * equivalent of postgres '*' operator
     */
    intersection(range: Range<T>): Range<T> {
        if (!this.overlaps(range) || range.isEmpty()) {
            return this.getEmptyRange();
        }

        let flags: number = 0;
        let lowerBound: number;
        let upperBound: number;

        if (this.lowerBound < range.lowerBound) {
            lowerBound = range.lowerBound;
            flags |= Range.FLAG_LOWER_INC & range.flags;
        } else if (this.lowerBound > range.lowerBound) {
            lowerBound = this.lowerBound;
            flags |= Range.FLAG_LOWER_INC & this.flags;
        } else {
            lowerBound = this.lowerBound;
            flags |= Range.FLAG_LOWER_INC & (this.flags & range.flags)
        }

        if (this.upperBound > range.upperBound) {
            upperBound = range.upperBound;
            flags |= Range.FLAG_UPPER_INC & range.flags;
        } else if (this.upperBound < range.upperBound) {
            upperBound = this.upperBound;
            flags |= Range.FLAG_UPPER_INC & this.flags;
        } else {
            upperBound = this.upperBound;
            flags |= Range.FLAG_UPPER_INC & (this.flags & range.flags)
        }

        return new Range<T>(this.numToVal(lowerBound), this.numToVal(upperBound), flags, this.valToNum, this.numToVal);
    }

    // TODO
    // difference(range: Range<T>): Range<T> {
    
    // }

    toString(): string {
        if (this.isEmpty()) {
            return 'empty';
        }
        const incLowerBound = this.lowerInc() ? '[' : '(';
        const incUpperBound = this.upperInc() ? ']' : ')';
        return `${incLowerBound}${this.numToVal(this.lowerBound)},${this.numToVal(this.upperBound)}${incUpperBound}`;
    }

    copy(): Range<T> {
        return new Range<T>(this.numToVal(this.lowerBound), this.numToVal(this.upperBound), this.flags, this.valToNum, this.numToVal);
    }
}