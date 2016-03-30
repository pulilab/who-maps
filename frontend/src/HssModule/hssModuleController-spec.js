import HssModuleController from './HssModuleController';

/* global define, it, describe, expect */
let cc = {};

describe('HssModuleController', () => {
    it('can be instatiated, and is defined', () => {
        cc = HssModuleController.hssControllerFactory()({});
        expect(cc).toBeDefined();
    });

    it('has a constructor', () => {
        cc.constructor({});
        expect(Array.isArray(cc.columnHasContent)).toBe(true);
    });

    // xdescribe('after initialized', () => {
    // 	it('holds the information about the columns having content', () = > {

    // 	});

    // 	it('fill the array with data on an event', () => {

    // 	});

    // 	it('if gets the proper event, reports back via another event', () => {

    // 	});
    // });
});
