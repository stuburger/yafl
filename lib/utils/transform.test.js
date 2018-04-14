"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var transform_1 = require("./transform");
var input1 = {
    name: 'stuart',
    age: 30,
    gender: 'male',
    contact: {
        tel: '0786656565'
    },
    favorites: ['books', 'rock n roll']
};
var expectedResult1 = {
    name: {
        value: 'stuart',
        originalValue: 'stuart',
        didBlur: false,
        touched: false
    },
    age: {
        value: 30,
        originalValue: 30,
        didBlur: false,
        touched: false
    },
    gender: {
        value: 'male',
        originalValue: 'male',
        didBlur: false,
        touched: false
    },
    contact: {
        value: {
            tel: '0786656565'
        },
        originalValue: {
            tel: '0786656565'
        },
        didBlur: false,
        touched: false
    },
    favorites: {
        value: ['books', 'rock n roll'],
        originalValue: ['books', 'rock n roll'],
        didBlur: false,
        touched: false
    }
};
var expectedResult2 = {
    name_name: 'stuart',
    age_age: 30,
    gender_gender: 'male',
    contact_contact: {
        tel: '0786656565'
    },
    favorites_favorites: ['books', 'rock n roll']
};
describe('transform objects', function () {
    var func = function (ret, value, key) {
        ret[key] = {
            value: value,
            originalValue: value,
            didBlur: false,
            touched: false
        };
        return ret;
    };
    var func2 = function (ret, value, key) {
        ret[key + '_' + key] = value;
        return ret;
    };
    var testResult1 = transform_1.default(input1, func);
    var testResult2 = transform_1.default(input1, func2);
    test('input1 should be transformed to expectedResult1', function () {
        expect(testResult1).toEqual(expectedResult1);
    });
    test('input1 should be transform to expectedResult2', function () {
        expect(testResult2).toEqual(expectedResult2);
    });
    test('values should be copies', function () {
        expect(input1.contact).not.toBe(testResult1.contact.value);
        expect(input1.contact).not.toBe(testResult1.contact.originalValue);
        expect(input1.favorites).not.toBe(testResult1.favorites.value);
        expect(input1.favorites).not.toBe(testResult1.favorites.originalValue);
        expect(testResult2.contact_contact).not.toBe(input1.contact);
        expect(testResult2.favorites_favorites).not.toBe(input1.favorites);
    });
    test('produce an empty object', function () {
        expect(transform_1.default({}, function () { return ({}); })).toEqual({});
    });
});
//# sourceMappingURL=transform.test.js.map