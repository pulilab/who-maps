import IntroJsController from './IntroJsController';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn */

let ic = {};
const $timeout = arg => {
    arg();
};

describe('introJsController', () => {

    beforeEach(() => {
        ic = IntroJsController.introJsFactory()($timeout);
    });

    it('should have a function that can parse an object in an introJS configuration object', () => {
        const elemDiv = document.createElement('div');
        elemDiv.className = 'test';

        ic.sourceString = {
            steps: [
                {
                    intro: '',
                    element: '.test'
                }
            ]
        };

        ic.parseOptions();
        expect(ic.options.steps.length).toBe(0);

        document.body.appendChild(elemDiv);
        document.body.appendChild(elemDiv);

        ic.parseOptions();
        expect(ic.options.steps.length).toBe(1);
        expect(ic.options.steps[0].element).toBeDefined();

        ic.sourceString.steps.push({ element: '.test' }); // invalid element
        ic.parseOptions();
        expect(ic.options.steps.length).toBe(1);

        delete(ic.sourceString.steps);
        ic.parseOptions();
        expect(ic.options.steps.length).toBe(0);
    });

    it('should have a function that return a dom element from a class string', () => {
        const className = 'test';
        const elemDiv = document.createElement('div');
        elemDiv.className = className;

        document.body.appendChild(elemDiv);

        const result = ic.element('.' + className);
        expect(result.item(0).outerHTML).toContain('div');
    });

    it('should have a function that lunch the introJS', () => {
        spyOn(ic.introJs, 'start');
        ic.start();
        expect(ic.introJs.start).toHaveBeenCalled();
    });

});
