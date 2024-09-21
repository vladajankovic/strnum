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
    skipLike: undefined
};

function toNumber(str, options = {}){
    options = Object.assign({}, defaultOptions, options);

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
        let str_int_num = int_num.toString();

        // for large numbers, perseInt can return e-notation
        if (str_int_num.search(/[eE]/) != -1) {
            if (options.eNotation) return int_num;
            return num;
        }

        if (num != str_int_num) return num;
        return int_num;      
    }
    
    // not a valid number
    return str;
}

module.exports = toNumber