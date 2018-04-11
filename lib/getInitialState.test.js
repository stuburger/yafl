"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const sum = require('./getInitialState');
var getInitialState_1 = require("./getInitialState");
var numberValue = {
    value: 5,
    originalValue: 5,
    didBlur: false,
    touched: false
};
var stringValue = {
    value: 'Bob',
    originalValue: 'Bob',
    didBlur: false,
    touched: false
};
var nullValue = {
    value: null,
    originalValue: null,
    didBlur: false,
    touched: false
};
var objectValue = {
    value: {
        name: 'stuart',
        contact: {
            tel: '0786656565'
        },
        favorites: ['books', 'rock n roll']
    },
    originalValue: {
        name: 'stuart',
        contact: {
            tel: '0786656565'
        },
        favorites: ['books', 'rock n roll']
    },
    didBlur: false,
    touched: false
};
describe('getting the initial state of a single form field with different value types', function () {
    describe('field state', function () {
        var initialState = getInitialState_1.getInitialFieldState(5);
        test('didBlur, touched should be false', function () {
            expect(initialState.didBlur).toBe(false);
            expect(initialState.touched).toBe(false);
        });
    });
    describe('primitive values', function () {
        test('number', function () {
            expect(getInitialState_1.getInitialFieldState(5)).toEqual(numberValue);
        });
        test('string', function () {
            expect(getInitialState_1.getInitialFieldState('Bob')).toEqual(stringValue);
        });
        test('undefined values initialized to null', function () {
            var result = getInitialState_1.getInitialFieldState();
            expect(result).toEqual(nullValue);
        });
    });
    describe('object values', function () {
        var value = {
            name: 'stuart',
            contact: {
                tel: '0786656565'
            },
            favorites: ['books', 'rock n roll']
        };
        var result = getInitialState_1.getInitialFieldState(value);
        test('values are equal', function () {
            expect(result).toEqual(objectValue);
        });
        test('values references are not equal', function () {
            expect(value).not.toBe(result.value);
            expect(value).not.toBe(result.originalValue);
            expect(result.value).not.toBe(result.originalValue);
        });
    });
});
var formResult = {
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
        value: null,
        originalValue: null,
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
describe('getting the initial form state from the intial value supplied', function () {
    var form = {
        name: 'stuart',
        age: 30,
        gender: undefined,
        contact: {
            tel: '0786656565'
        },
        favorites: ['books', 'rock n roll']
    };
    var result = getInitialState_1.default(form);
    test('form state to be initialized correctly', function () {
        expect(result).toEqual(formResult);
    });
});
//# sourceMappingURL=getInitialState.test.js.map