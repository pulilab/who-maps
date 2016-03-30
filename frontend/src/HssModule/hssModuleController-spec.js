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

    it('has a function which refreshes the array containing info about column contents', () => {
        const arrMock = [true, true, false, true];
        cc.reFresh(arrMock);
        expect(cc.columnHasContent).toBe(arrMock);
    });

    it('answers to questions regarding columns having content', () => {
        spyOn(window.EE, 'emit');
        cc.onAskIfColumnGotContent();
        expect(window.EE.emit).toHaveBeenCalled();
    });

    it('answers to questions regarding last two column having any content', () => {
        spyOn(window.EE, 'emit');
        cc.onLastTwoContentAsked();
        expect(window.EE.emit).toHaveBeenCalled();
    });

    it('simply forwards simple activation requests', () => {
        spyOn(window.EE, 'emit');
        const mock = 'this string should be an object';
        cc.askedToActivateColumn(mock);
        expect(window.EE.emit).toHaveBeenCalled();
    });
});
