const toNumber = require("./strnum");

describe("Should convert all the valid numeric strings to number", () => {
    it("should return same output as input for invalid cases", () => {
        expect(toNumber(undefined)).not.toBeDefined();
        expect(toNumber(null)).toEqual(null);
        expect(toNumber("")).toEqual("");
        expect(toNumber("string")).toEqual("string");

        expect(toNumber("12,12")).toEqual("12,12");
        expect(toNumber("12 12")).toEqual("12 12");
        expect(toNumber("12-12")).toEqual("12-12");
        expect(toNumber("12.12.12")).toEqual("12.12.12");
        
        expect(toNumber("+ 12")).toEqual("+ 12");
        expect(toNumber("12+12")).toEqual("12+12");
        expect(toNumber("1212+")).toEqual("1212+");
        expect(toNumber("+12 12")).toEqual("+12 12");
        expect(toNumber("    +12 12   ")).toEqual("    +12 12   ");

        expect(toNumber("0xzz")).toEqual("0xzz");
        expect(toNumber("iweraf0x123qwerqwer")).toEqual("iweraf0x123qwerqwer");
        expect(toNumber("1230x55")).toEqual("1230x55");
        expect(toNumber("JVBERi0xLjMNCiXi48")).toEqual("JVBERi0xLjMNCiXi48");
    });
    it("should handle binary numbers", () => {
        expect(toNumber("b0")).toEqual(0);
        expect(toNumber("+b0")).toEqual(0);
        expect(toNumber("-b0")).toEqual(-0);
        expect(toNumber("b101")).toEqual(5);
        expect(toNumber("+b01111")).toEqual(15);
        expect(toNumber("-b111")).toEqual(-7);
        expect(toNumber("   b101   ")).toEqual(5);
        expect(toNumber("   +b01111")).toEqual(15);
        expect(toNumber("-b111   ")).toEqual(-7);
        expect(toNumber("b00000000")).toEqual(0);
    })
    it("should handle integer numbers", () => {
        expect(toNumber("6")).toEqual(6);
        expect(toNumber("+06")).toEqual(6);
        expect(toNumber("-06")).toEqual(-6);
        expect(toNumber("-06", { removeLeadingZeros: true })).toEqual(-6);
        expect(toNumber("-06", { removeLeadingZeros: false })).toEqual("-06");
        expect(toNumber("06")).toEqual(6);
        expect(toNumber("06", { removeLeadingZeros: true })).toEqual(6);
        expect(toNumber("06", { removeLeadingZeros: false })).toEqual("06");
        
        expect(toNumber("006")).toEqual(6);
        expect(toNumber("006", { removeLeadingZeros: true })).toEqual(6);
        expect(toNumber("006", { removeLeadingZeros: false })).toEqual("006");

        expect(toNumber("6", { removePositiveSign: true })).toEqual(6);
        expect(toNumber("+6", { removePositiveSign: true })).toEqual(6);
        expect(toNumber("+6", { removePositiveSign: false })).toEqual("+6");
        expect(toNumber("-6", { removePositiveSign: true })).toEqual(-6);

        expect(toNumber("+06", { removeLeadingZeros: true, removePositiveSign: true })).toEqual(6);
        expect(toNumber("+06", { removeLeadingZeros: true, removePositiveSign: false })).toEqual("+6");
        expect(toNumber("+06", { removeLeadingZeros: false, removePositiveSign: true })).toEqual("06");
        expect(toNumber("+06", { removeLeadingZeros: false, removePositiveSign: false })).toEqual("+06");

        expect(toNumber("0000000000000000000000000", { removeLeadingZeros: false })).toEqual("0000000000000000000000000");
        expect(toNumber("0000000000000000000000000", { removeLeadingZeros: true })).toEqual(0);

        expect(toNumber("000000000000000000000000017717", { removeLeadingZeros: false })).toEqual("000000000000000000000000017717");
        expect(toNumber("000000000000000000000000017717", { removeLeadingZeros: true })).toEqual(17717);

        expect(toNumber("   +1212   ")).toEqual(1212);
        expect(toNumber("+1212121212")).toEqual(1212121212);

        expect(toNumber("420926189200190257681175017717")).toEqual(4.209261892001902e+29);
        expect(toNumber("0420926189200190257681175017717")).toEqual(4.209261892001902e+29);
        expect(toNumber("420926189200190257681175017717", { eNotation: false })).toEqual("420926189200190257681175017717");

        expect(toNumber("020211201030005811824")).toEqual("20211201030005811824");
        expect(toNumber("020211201030005811824", { removeLeadingZeros: false })).toEqual("020211201030005811824");
        expect(toNumber("+020211201030005811824")).toEqual("20211201030005811824");
        expect(toNumber("+20211201030005811824", { removePositiveSign: false })).toEqual("+20211201030005811824");
    })
    it("should parse hexadecimal values", () => {
        expect(toNumber("0x2f")).toEqual(47);
        expect(toNumber("-0x2f")).toEqual(-47);
        expect(toNumber("0x2f", { parseHex: true })).toEqual(47);
        expect(toNumber("-0x2f", { parseHex: true })).toEqual(-47);
        expect(toNumber("0x002f", { parseHex: true })).toEqual(47);
        expect(toNumber("-0x002f", { parseHex: true })).toEqual(-47);
        expect(toNumber("0x2f", { parseHex: false })).toEqual("0x2f");
        expect(toNumber("-0x2f", { parseHex: false })).toEqual("-0x2f");
        expect(toNumber("0x002f", { parseHex: false })).toEqual("0x002f");
        expect(toNumber("-0x002f", { parseHex: false })).toEqual("-0x002f");
    })
    it("invalid floating number", () => {
        expect(toNumber("20.21.030")).toEqual("20.21.030");
        expect(toNumber("0.21.030")).toEqual("0.21.030");
        expect(toNumber("0.21.")).toEqual("0.21.");
        expect(toNumber(".")).toEqual(".");
    });
    it("floating point and leading zeros", () => {
        expect(toNumber("0.0")).toEqual(0);
        expect(toNumber("00.00")).toEqual(0);
        expect(toNumber("0.06")).toEqual(0.06);
        expect(toNumber("00.6")).toEqual(0.6);
        expect(toNumber(".006")).toEqual(0.006);
        expect(toNumber("6.0")).toEqual(6);
        expect(toNumber("06.0")).toEqual(6);

        expect(toNumber("0.")).toEqual(0);
        expect(toNumber("1.")).toEqual(1);
        expect(toNumber(".0")).toEqual(0);
        expect(toNumber(".1")).toEqual(0.1);
        expect(toNumber("-0.")).toEqual(-0);
        expect(toNumber("-1.")).toEqual(-1);
        expect(toNumber("-.0")).toEqual(-0);
        expect(toNumber("-.1")).toEqual(-0.1);
        
        expect(toNumber("0.0", { removeLeadingZeros: false })).toEqual(0);
        expect(toNumber("00.00", { removeLeadingZeros: false })).toEqual("00");
        expect(toNumber("00.00", { removeLeadingZeros: false, removeTrailingZeros: false })).toEqual("00.00");
        expect(toNumber("00.00", { removeTrailingZeros: false })).toEqual("0.00");
        expect(toNumber("0.06", { removeLeadingZeros: false })).toEqual(0.06);
        expect(toNumber("00.6", { removeLeadingZeros: false })).toEqual("00.6");
        expect(toNumber(".006", { removeLeadingZeros: false })).toEqual(0.006);
        expect(toNumber("6.0", { removeLeadingZeros: false })).toEqual(6);
        expect(toNumber("06.0", { removeLeadingZeros: false })).toEqual("06");
        expect(toNumber("06.0", { removeLeadingZeros: false, removeTrailingZeros: false })).toEqual("06.0");
        expect(toNumber("06.0", { removeTrailingZeros: false })).toEqual("6.0");
        expect(toNumber("06.0")).toEqual(6);
    })
    it("negative number  leading zeros", () => {
        expect(toNumber("-0.0")).toEqual(-0);
        expect(toNumber("-00.00")).toEqual(-0);
        expect(toNumber("-0.06")).toEqual(-0.06);
        expect(toNumber("-00.6")).toEqual(-0.6);
        expect(toNumber("-.006")).toEqual(-0.006);
        expect(toNumber("-6.0")).toEqual(-6);
        expect(toNumber("-06.0")).toEqual(-6);
        
        expect(toNumber("-0.0"   , { removeLeadingZeros: false })).toEqual(-0);
        expect(toNumber("-00.00", { removeLeadingZeros: false })).toEqual("-00");
        expect(toNumber("-00.00", { removeLeadingZeros: false, removeTrailingZeros: false })).toEqual("-00.00");
        expect(toNumber("-00.00", { removeTrailingZeros: false })).toEqual("-0.00");
        expect(toNumber("-0.06", { removeLeadingZeros: false })).toEqual(-0.06);
        expect(toNumber("-00.6", { removeLeadingZeros: false })).toEqual("-00.6");
        expect(toNumber("-.006")).toEqual(-0.006);
        expect(toNumber("-6.0")).toEqual(-6);
        expect(toNumber("-06.0"  , { removeLeadingZeros: false })).toEqual("-06");
        expect(toNumber("-06.0"  , { removeTrailingZeros: false })).toEqual("-6.0");
        expect(toNumber("-06.0"  , { removeLeadingZeros: false, removeTrailingZeros: false })).toEqual("-06.0");

        expect(toNumber("20.2112")).toEqual(20.2112);
        expect(toNumber("-000020.211200000")).toEqual(-20.2112);
        expect(toNumber("20.211200000", { removeTrailingZeros: false })).toEqual("20.211200000");
        expect(toNumber("20.211201030005811824")).toEqual("20.211201030005811824");
        expect(toNumber("-20.211201030005811824")).toEqual("-20.211201030005811824");
        expect(toNumber("0.211201030005811824")).toEqual("0.211201030005811824");

        expect(toNumber("+12.12")).toEqual(12.12);
        expect(toNumber("-12.12")).toEqual(-12.12);
        expect(toNumber("-012.12")).toEqual(-12.12);
        expect(toNumber("-12.1200")).toEqual(-12.12);
    })
    // it("scientific notation", () => {
    //     expect(toNumber("01.0e2"  , { removeLeadingZeros: false})).toEqual("01.0e2");
    //     expect(toNumber("-01.0e2"  , { removeLeadingZeros: false})).toEqual("-01.0e2");
    //     expect(toNumber("01.0e2") ).toEqual(100);
    //     expect(toNumber("-01.0e2") ).toEqual(-100);
    //     expect(toNumber("1.0e2") ).toEqual(100);

    //     expect(toNumber("-1.0e2") ).toEqual(-100);
    //     expect(toNumber("1.0e-2")).toEqual(0.01);

        
    // });

    // it("scientific notation with upper E", () => {
    //     expect(toNumber("01.0E2"  , { removeLeadingZeros: false})).toEqual("01.0E2");
    //     expect(toNumber("-01.0E2"  , { removeLeadingZeros: false})).toEqual("-01.0E2");
    //     expect(toNumber("01.0E2") ).toEqual(100);
    //     expect(toNumber("-01.0E2") ).toEqual(-100);
    //     expect(toNumber("1.0E2") ).toEqual(100);

    //     expect(toNumber("-1.0E2") ).toEqual(-100);
    //     expect(toNumber("1.0E-2")).toEqual(0.01);
    // });
    
    it("should skip matching pattern", () => {
        expect(toNumber("+12", { skipLike: /\+[0-9]{10}/} )).toEqual(12);
        expect(toNumber("12+12", { skipLike: /\+[0-9]{10}/} )).toEqual("12+12");
        expect(toNumber("12+1212121212", { skipLike: /\+[0-9]{10}/} )).toEqual("12+1212121212");
        expect(toNumber("+1212121212", { skipLike: /\+[0-9]{10}/} )).toEqual("+1212121212");
    })
});
