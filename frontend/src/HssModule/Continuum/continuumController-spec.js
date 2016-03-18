import ContinuumController from './ContinuumController';

/* global define, it, describe, expect, beforeEach */

let cc = {};
const $timeout = (arg) => {
    arg();
};

describe('continuumController', () => {

    beforeEach(() => {
        cc = ContinuumController.continuumFactory()($timeout);
        cc.tiles = 7;
        cc.uList = cc.uListGenerator();
    });


    it('should have a function that return a map of tiles', () => {
        const firstRow = cc.firstRowGenerator();
        expect(firstRow.length).toBe(cc.tiles);

        firstRow.forEach((value) => {
            expect(value.hasOwnProperty('icon')).toBeTruthy();
            expect(value.hasOwnProperty('colSpan')).toBeTruthy();
            expect(value.hasOwnProperty('rowSpan')).toBeTruthy();
            expect(value.hasOwnProperty('className')).toBeTruthy();
        });

    });
});
