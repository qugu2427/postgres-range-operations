import { DateRange } from "../date-range";

const range: DateRange = DateRange.fromString("(10-07-2001,02-14-2025)");
describe(range.toString(), () => {
    it('constructs correctly', () => {
        expect(range.lowerBound).toEqual(new Date("10-07-2001").getTime());
        expect(range.upperBound).toEqual(new Date("02-14-2025").getTime());
        expect(range.toString()).toEqual("(10-07-2001,02-14-2025)")
    }); 
});