export class Range<T extends number | Date> {
    protected static readonly DEFAULT_RANGE_RGX: RegExp = /^.+$/;

    static readonly FLAG_EMPTY: number = 0b100
    static readonly FLAG_CLOSED_LOWER_BOUND: number = 0b010;
    static readonly FLAG_CLOSED_UPPER_BOUND: number = 0b001;

    private flags = 0;
    private lowerBound: T;
    private upperBound: T;

    constructor(lowerBound: T, upperBound: T, flags: number) {
        if (lowerBound > upperBound) {
            throw new Error("lower bound greater than upper bound")
        }
        this.lowerBound = lowerBound;
        this.upperBound = upperBound;
        this.flags = flags;
    }

    private hasFlag(flag: number): boolean {
        return (this.flags & flag) != 0;
    }

    // getEmptyRange(): Range<T> {
    //     return new Range<T>(0, 0, Range.FLAG_EMPTY);
    // }

    getFlags(): number {
        return this.flags;
    }

    setLowerBound(lowerBound: T): void {
        if (lowerBound > this.upperBound) {
            throw new Error("lower bound greater than upper bound")
        }
        this.lowerBound = lowerBound
    }

    getLowerBound(): T {
        return this.lowerBound;
    }

    setUpperBound(upperBound: T): void {
        if (upperBound < this.lowerBound) {
            throw new Error("upper bound less than lower bound")
        }
        this.upperBound = upperBound;
    }

    getUpperBound(): T {
        return this.upperBound;
    }

    hasClosedLowerBound(): boolean {
        return this.hasFlag(Range.FLAG_CLOSED_LOWER_BOUND);
    }

    hasClosedUpperBound(): boolean {
        return this.hasFlag(Range.FLAG_CLOSED_UPPER_BOUND);
    }

    isEmpty(): boolean {
        return this.hasFlag(Range.FLAG_EMPTY);
    }

    // equals
    eq(range: Range<T>): boolean {
        if (this.isEmpty() && range.isEmpty()) {
            return true;
        }
        return this.lowerBound === range.getLowerBound() &&
            this.upperBound === range.getUpperBound() &&
            this.flags === range.getFlags();
    }

    // less than
    lt(range: Range<T>): boolean {
        if (this.isEmpty() || range.isEmpty()) {
            return false;
        } else if (this.lowerBound === range.getLowerBound()) {
            return this.hasClosedLowerBound() && !range.hasClosedLowerBound();
        }
        return this.lowerBound < range.getLowerBound();
    }

    // less than or equal to
    le(range: Range<T>): boolean {
        if (this.isEmpty() || range.isEmpty()) {
            return this.isEmpty() === range.isEmpty();
        }
        return this.lowerBound === range.getLowerBound() || this.lowerBound < range.getLowerBound();
    }

    // greater than
    gt(range: Range<T>): boolean {
        if (this.isEmpty() || range.isEmpty()) {
            return false;
        } else if (this.upperBound === range.getUpperBound()) {
            return this.hasClosedUpperBound() && !range.getUpperBound();
        }
        return this.upperBound > range.getUpperBound();
    }
    
    // greater than or equal to
    ge(range: Range<T>): boolean {
        if (this.isEmpty() || range.isEmpty()) {
            return this.isEmpty() === range.isEmpty();
        }
        return this.upperBound === range.getUpperBound() || this.upperBound > range.getUpperBound();
    }

    containsRange(range: Range<T>): boolean {
        return this.le(range) && this.ge(range);
    }

    containsPoint(point: T): boolean {
        if (this.isEmpty()) {
            return false;
        }
        return (point > this.lowerBound && point < this.upperBound) ||
            (point === this.lowerBound && this.hasClosedLowerBound()) ||
            (point === this.upperBound && this.hasClosedUpperBound());
    }

    overlaps(range: Range<T>): boolean {
        if (this.isEmpty() || range.isEmpty()) {
            return false;
        }
        return !(this.leftOf(range) || this.rightOf(range));
    }

    // strictly left of
    leftOf(range: Range<T>): boolean {
        if (this.isEmpty() || range.isEmpty()) {
            return false;
        }
        return this.upperBound < range.getLowerBound() ||
            (this.upperBound === range.getLowerBound() && !range.getLowerBound());
    }

    // strictly right of
    rightOf(range: Range<T>): boolean {
        if (this.isEmpty() || range.isEmpty()) {
            return false;
        }
        return this.lowerBound > range.getUpperBound() ||
            (this.lowerBound === range.getUpperBound() && !range.getUpperBound());
    }

    adjacentTo(range: Range<T>): boolean {
        if (this.isEmpty() || range.isEmpty()) {
            return false;
        }
        return this.upperBound === range.getLowerBound() ||
            this.lowerBound === range.getUpperBound();
    }

    intersection(range: Range<T>): Range<T> {
        if (!this.overlaps(range)) {
            return new Range<T>(0 as T, 0 as T, Range.FLAG_EMPTY);
        }

        let flags: number = 0;
        let lowerBound: T;
        let upperBound: T;

        if (range.lowerBound < this.lowerBound) {
            lowerBound = this.lowerBound;
        } else if (range.lowerBound > this.lowerBound) {
            lowerBound = range.lowerBound;
        } else if (range.hasClosedLowerBound() && this.hasClosedLowerBound()) {
            lowerBound = this.lowerBound;
            flags |= Range.FLAG_CLOSED_LOWER_BOUND;
        } else {
            lowerBound = this.lowerBound;
        }

        if (range.upperBound > this.upperBound) {
            upperBound = this.upperBound;
        } else if (range.upperBound < this.upperBound) {
            upperBound = range.upperBound;
        } else if (range.hasClosedUpperBound() && this.hasClosedUpperBound()) {
            upperBound = this.upperBound;
            flags |= Range.FLAG_CLOSED_UPPER_BOUND;
        } else {
            upperBound = this.upperBound;
        }

        return new Range<T>(lowerBound, upperBound, flags);
    }

    // union(range: Range<T>): Range<T> {

    // }

    // union(range: IntRange): IntRange {
    //     return range.
    // }

    // intersection(range: IntRange): IntRange {

    // }

    // difference(range: IntRange): IntRange {
        
    // }

    toString(): string {
        if (this.isEmpty()) {
            return 'empty';
        }
        const incLowerBound = this.hasClosedLowerBound() ? '[' : '(';
        const incUpperBound = this.hasClosedUpperBound() ? ']' : ')';
        return `${incLowerBound}${this.lowerBound},${this.upperBound}${incUpperBound}`;
    }
}