# postgres-range-operations ![Test](https://github.com/qugu2427/postgres-range-operations/actions/workflows/test.yml/badge.svg)

A simple typescript implemtation of postgres range operations as described [here](https://www.postgresql.org/docs/9.3/functions-range.html).

## NumRange
```typescript
const range: NumRange = NumRange.fromString("(1,2]");

range.upper() // 2
range.lower() // 1

range.upperInc() // true
range.lowerInc() // false

range.upperInf() // false
range.lowerInf() // false

range.equals(NumRange.fromString("(1,2]")) // true

range.notExtLeftOf(NumRange.fromString("(0,2]")) // true
range.notExtRightOf(NumRange.fromString("(1,3)")) // true

range.containsRange(NumRange.fromString("(1,2)")) // true
range.containsPoint(2) // true

// bounds can be infinity (i.e (,) = (-Infinity,Infinity))
range.overlaps(NumRange.fromString("(,)")) // true

// ranges can also be empty 
// ex: (3,3) = empty, bounds will be stored as NaN
range.overlaps(NumRange.fromString("empty")) // false

range.strictlyLeftOf(NumRange.fromString("(2,3)")) // true
range.strictlyRightOf(NumRange.fromString("(,1]")) // true

range.adjacentTo(NumRange.fromString("(2,3)")) // true

range.union(NumRange.fromString("(,1]")) // (,2]

range.union(NumRange.fromString("(3,4)")) // error - cannot union disjoint ranges

range.intersection(NumRange.fromString("(1,2)")) // (1,2)
range.intersection(NumRange.fromString("(0,1])")) // empty

range.difference(NumRange.fromString("(0,1.5]")) // (1.5,2]
range.difference(NumRange.fromString("(0,100)")) // error - cannot difference to disjoint ranges

// construct without fromString
new NumRange(1,2, Range.FLAG_LOWER_INC | Range.FLAG_UPPER_INC) // [1,2]
new NumRange(-Infinity,2) // (,2)
```
## DateRange
```typescript
const range: DateRange = DateRange.fromString("(10-07-2001,02-14-2025)");
```
## Custom Range Types
You can create custom range types by extending `Range<T>`.
