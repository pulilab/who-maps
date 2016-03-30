import HssModuleController from './HssModuleController';

/* global define, it, describe, expect */

describe('HssModuleController', () => {
	it('can be instatiated, and is defined', () => {
		const cc = HssModuleController.hssControllerFactory()({});
		expect(cc).toBeDefined();
	});

	it('has a constructor', () => {
		const cc = HssModuleController.hssControllerFactory()({});
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
