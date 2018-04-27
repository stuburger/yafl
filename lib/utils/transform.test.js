"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transform_1 = require("./transform");
const input1 = {
    name: 'stuart',
    age: 30,
    gender: 'male',
    contact: {
        tel: '0786656565'
    },
    favorites: ['books', 'rock n roll']
};
const expectedResult1 = {
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
const expectedResult2 = {
    name_name: 'stuart',
    age_age: 30,
    gender_gender: 'male',
    contact_contact: {
        tel: '0786656565'
    },
    favorites_favorites: ['books', 'rock n roll']
};
describe('transform objects', () => {
    const func = (ret, value, key) => {
        ret[key] = {
            value: value,
            originalValue: value,
            didBlur: false,
            touched: false
        };
        return ret;
    };
    const func2 = (ret, value, key) => {
        ret[key + '_' + key] = value;
        return ret;
    };
    const testResult1 = transform_1.default(input1, func);
    const testResult2 = transform_1.default(input1, func2);
    test('input1 should be transformed to expectedResult1', () => {
        expect(testResult1).toEqual(expectedResult1);
    });
    test('input1 should be transform to expectedResult2', () => {
        expect(testResult2).toEqual(expectedResult2);
    });
    test('values should be copies', () => {
        expect(input1.contact).not.toBe(testResult1.contact.value);
        expect(input1.contact).not.toBe(testResult1.contact.originalValue);
        expect(input1.favorites).not.toBe(testResult1.favorites.value);
        expect(input1.favorites).not.toBe(testResult1.favorites.originalValue);
        expect(testResult2.contact_contact).not.toBe(input1.contact);
        expect(testResult2.favorites_favorites).not.toBe(input1.favorites);
    });
    test('produce an empty object', () => {
        expect(transform_1.default({}, () => ({}))).toEqual({});
    });
});
//# sourceMappingURL=transform.test.js.map