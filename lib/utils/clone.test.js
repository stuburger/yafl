"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clone_1 = require("./clone");
var input1 = {
    name: 'stuart',
    age: 30,
    gender: 'male',
    contact: {
        tel: '0786656565'
    },
    favorites: ['books', 'rock n roll'],
    deep: {
        a: {
            b: '0786656565'
        },
        c: [{ d: 'test1' }, { e: 'test2' }]
    }
};
describe('clone objects', function () {
    var testResult1 = clone_1.default(input1);
    test('input1 should be clone to expectedResult1', function () {
        expect(testResult1).toEqual(input1);
        expect(clone_1.default(null)).toEqual(null);
        expect(clone_1.default(undefined)).toEqual(undefined);
    });
    test('expectedResult1 should not contain any references to input1', function () {
        expect(testResult1.contact).not.toBe(input1.contact);
        expect(testResult1.favorites).not.toBe(input1.contact);
        expect(testResult1.deep).not.toBe(input1.deep);
        expect(testResult1.deep.a).not.toBe(input1.deep.a);
        expect(testResult1.deep.c).not.toBe(input1.deep.c);
    });
});
//# sourceMappingURL=clone.test.js.map