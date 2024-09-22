const intRegex = /^[-+]?[0-9]+$/;
const fltRegex = /^[-+]?([0-9]*\.[0-9]+|[0-9]+\.[0-9]*)$/;
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
const isStrnigExp = (s) => { return expRegex.test(s); }
  
const defaultOptions = {
    parseInt: true,
    parseFloat: true,
    parseOctal: true,
    parseBinary: true,
    parseHex: true,
    parseExp: true,
    removePositiveSign: true,
    removeLeadingZeros: true,
    removeTrailingZeros: true,
    decimalPlaces: -1,
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

    if (options.parseBinary && isStringBin(num)) {
        return Number.parseInt(num.replace('b', ''), 2);
    }

    if (options.parseOctal && isStringOct(num)) {
        return Number.parseInt(num.replace('o', ''), 8);
    }

    if (options.parseInt && isStringInt(num)) {
        const hasSign = RegExp(/^[+-]/).test(num);
        const sign = hasSign ? num[0] : '+';

        num = hasSign ? num.slice(1) : num;

        if (options.removeLeadingZeros) {
            num = num.replace(/^0+/, '');
            if (!isStringInt(num)) num = '0';
        }

        num = hasSign ? sign + num : num;

        if (options.removePositiveSign) {
            if (hasSign && sign === '+') {
                num = num.slice(1);
                hasSign = false;
            }
        }

        let int_num = Number.parseInt(num);
        let str_int_num = int_num.toString();

        // for large numbers, perseInt can return e-notation
        if (str_int_num.search(/[eE]/) != -1) {
            if (options.eNotation) return int_num;
            return num;
        }

        if (num != str_int_num){
            // case: num = "-0" then int_num = -0
            if (num === '-0') return int_num;
            return num;
        }
        return int_num;      
    }

    if (options.parseFloat && isStringFlt(num)) {
        if (options.decimalPlaces < -1) options.decimalPlaces = -1;
        if (options.decimalPlaces > 100) options.decimalPlaces = 100;

        const hasSign = RegExp(/^[+-]/).test(num);
        const sign = hasSign ? num[0] : '+';

        num = hasSign ? num.slice(1) : num;
        let [integral, decimal] = num.split('.');

        integral = isStringInt(integral) ? integral : '0';
        decimal = isStringInt(decimal) ? decimal : '0';

        if (options.removeLeadingZeros) {
            integral = integral.replace(/^0+/, '');
            if (!isStringInt(integral)) integral = '0';
        }

        if (options.removeTrailingZeros) {
            decimal = decimal.replace(/0+$/, '');
        }

        num = isStringInt(decimal) ? integral + '.' + decimal : integral;
        num = hasSign ? sign + num : num;

        if (options.removePositiveSign) {
            if (hasSign && sign === '+') {
                num = num.slice(1);
                hasSign = false;
            }
        }

        // ignore decimal percision
        if (options.decimalPlaces === -1) {
            let float_num = Number.parseFloat(num);
            let str_float_num = float_num.toString();

            if (num != str_float_num) {
                // case: num = "-0" then float_num = -0
                if (num === '-0') return float_num;
                return num;
            }
            return float_num;
        }

        if (!isStringInt(decimal)) num += '.0';

        let result = integral.match(/[1-9]/)
        let idx2 = result !== null ? result.index : integral.length - 1;
        if (hasSign) idx2++;
        let front = num.slice(0, idx2);
        num = num.slice(idx2);

        let idx = num.indexOf('.');
        for (let cnt = options.decimalPlaces; cnt > 0; cnt--) {
            idx++;
            if (idx === num.length - 1) num += '0';
        }

        if (num[idx] === '.') {
            let [i, d] = num.split('.');
            let m1 = 0;
            for (let ii = parseInt(i); ii > 0; m1++, ii = Math.floor(ii/10));
            if ((d[0] - '0' > 5) || ((d[0] - '0' === 5) && ((i[i.length - 1] - '0') % 2 === 1))) {
                i = Number.parseInt(i) + 1;
                let m2 = 0;
                for (let ii = parseInt(i); ii > 0; m2++, ii = Math.floor(ii/10));
                if (m2 > m1 && front[front.length - 1] === '0') front = front.slice(0, front.length - 1);
            }
            num = front + i;
        }
        else {
            // TODO round decimal part
        }

        return num;
    }

    if (options.parseExp && isStrnigExp(num)) {
        // TODO - handle scientific values
        return "handle scientific numbers";
    }
    
    // not a valid number
    return str;
}

module.exports = toNumber

console.log(toNumber("999.6", {decimalPlaces: 0, removeLeadingZeros: false, removePositiveSign: false}))