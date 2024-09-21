const intRegex = /^[-+]?[0-9]+$/;
const fltRegex = /^[-+]?[0-9]*\.[0-9]+$/;
const octRegex = /^[-+]?o[0-7]+$/;
const binRegex = /^[-+]?b[0-1]+$/;
const hexRegex = /^[-+]?0x[0-9A-Fa-f]+$/;
const expRegex = /^[-+]?([0-9]+|[0-9]*\.[0-9]+)[eE][-+]?[0-9]+$/;

//polyfill
if (!Number.parseInt && window.parseInt) {
    Number.parseInt = window.parseInt;
}
if (!Number.parseFloat && window.parseFloat) {
    Number.parseFloat = window.parseFloat;
}

// helper functions
const isString    = (s) => { return s && typeof s === "string"; }
const isStringInt = (s) => { return intRegex.test(s); }
const isStringFlt = (s) => { return fltRegex.test(s); }
const isStringOct = (s) => { return octRegex.test(s); }
const isStringBin = (s) => { return binRegex.test(s); }
const isStringHex = (s) => { return hexRegex.test(s); }
  
const defaultOptions = {
    parseInt : true,
    parseFlt : true,
    parseOct : true,
    parseBin : true,
    parseHex : true,
    removeLeadingZeros: true,
    removePositiveSign: true,
    eNotation: true,
    skipLike: undefined,
    leadingZeros : true
};

function toNumber(str, options = {}){
    options = Object.assign({}, defaultOptions, options );

    if(!isString(str)) {
        return str;
    }
    
    let num = String(str.trim());

    if(options.skipLike !== undefined && options.skipLike.test(num)) {
        return str;
    }

    if (options.parseHex && isStringHex(num)) {
        return Number.parseInt(num, 16);
    }

    if (options.parseBin && isStringBin(num)) {
        return Number.parseInt(num.replace('b', ''), 2);
    }

    if (options.parseOct && isStringOct(num)) {
        return Number.parseInt(num.replace('o', ''), 8);
    }

    if (options.parseInt && isStringInt(num)) {
        const hasSign = RegExp(/^[+-]/).test(num[0]);
        const sign = hasSign ? num[0] : '+';

        if (options.removeLeadingZeros) {
            if (hasSign) num = num.slice(1);
            num = num.replace(/^0+/, '');
            if (hasSign) num = sign + num;
        }

        if (options.removePositiveSign) {
            num = hasSign && sign === '+' ? num.slice(1) : num;
        }

        let int_num = Number.parseInt(num);

        if (num != int_num.toString()) return num;
        return int_num;      
    }
    // else{
    //     //separate negative sign, leading zeros, and rest number
    //     const match = numRegex.exec(num);
    //     if(match){
    //         const sign = match[1];
    //         const leadingZeros = match[2];
    //         let numTrimmedByZeros = trimZeros(match[3]); //complete num without leading zeros
    //         //trim ending zeros for floating number
            
    //         const eNotation = match[4] || match[6];
    //         if(!options.leadingZeros && leadingZeros.length > 0 && sign && num[2] !== ".") return str; //-0123
    //         else if(!options.leadingZeros && leadingZeros.length > 0 && !sign && num[1] !== ".") return str; //0123
    //         else{//no leading zeros or leading zeros are allowed
    //             const num = Number(num);
    //             const numStr = "" + num;
    //             if(numStr.search(/[eE]/) !== -1){ //given number is long and parsed to eNotation
    //                 if(options.eNotation) return num;
    //                 else return str;
    //             }else if(eNotation){ //given number has enotation
    //                 if(options.eNotation) return num;
    //                 else return str;
    //             }else if(num.indexOf(".") !== -1){ //floating number
    //                 // const decimalPart = match[5].substr(1);
    //                 // const intPart = trimmedStr.substr(0,trimmedStr.indexOf("."));

                    
    //                 // const p = numStr.indexOf(".");
    //                 // const givenIntPart = numStr.substr(0,p);
    //                 // const givenDecPart = numStr.substr(p+1);
    //                 if(numStr === "0" && (numTrimmedByZeros === "") ) return num; //0.0
    //                 else if(numStr === numTrimmedByZeros) return num; //0.456. 0.79000
    //                 else if( sign && numStr === "-"+numTrimmedByZeros) return num;
    //                 else return str;
    //             }
                
    //             if(leadingZeros){
    //                 // if(numTrimmedByZeros === numStr){
    //                 //     if(options.leadingZeros) return num;
    //                 //     else return str;
    //                 // }else return str;
    //                 if(numTrimmedByZeros === numStr) return num;
    //                 else if(sign+numTrimmedByZeros === numStr) return num;
    //                 else return str;
    //             }

    //             if(num === numStr) return num;
    //             else if(num === sign+numStr) return num;
    //             // else{
    //             //     //number with +/- sign
    //             //     trimmedStr.test(/[-+][0-9]);

    //             // }
    //             return str;
    //         }
    //         // else if(!eNotation && trimmedStr && trimmedStr !== Number(trimmedStr) ) return str;
            
    //     }else{ //non-numeric string
    //         return str;
    //     }
    // }
    return str;
}

/**
 * 
 * @param {string} numStr without leading zeros
 * @returns 
 */
function trimZeros(numStr){
    if(numStr && numStr.indexOf(".") !== -1){//float
        numStr = numStr.replace(/0+$/, ""); //remove ending zeros
        if(numStr === ".")  numStr = "0";
        else if(numStr[0] === ".")  numStr = "0"+numStr;
        else if(numStr[numStr.length-1] === ".")  numStr = numStr.substr(0,numStr.length-1);
        return numStr;
    }
    return numStr;
}
module.exports = toNumber

// let x = "+00011111111111111111111"
// console.log(x)
// console.log(toNumber(x))
// console.log(toNumber(" 06", {removeLeadingZeros: false, removePositiveSign: false}));
// console.log(toNumber("+06", {removeLeadingZeros: false, removePositiveSign: false}));
// console.log(toNumber("-06", {removeLeadingZeros: false, removePositiveSign: false}));
// console.log(toNumber(" 06", {removeLeadingZeros: false, removePositiveSign: true}));
// console.log(toNumber("+06", {removeLeadingZeros: false, removePositiveSign: true}));
// console.log(toNumber("-06", {removeLeadingZeros: false, removePositiveSign: true}));
// console.log(toNumber(" 06", {removeLeadingZeros: true, removePositiveSign: false}));
// console.log(toNumber("+06", {removeLeadingZeros: true, removePositiveSign: false}));
// console.log(toNumber("-06", {removeLeadingZeros: true, removePositiveSign: false}));
// console.log(toNumber(" 06", {removeLeadingZeros: true, removePositiveSign: true}));
// console.log(toNumber("+06", {removeLeadingZeros: true, removePositiveSign: true}));
// console.log(toNumber("-06", {removeLeadingZeros: true, removePositiveSign: true}));