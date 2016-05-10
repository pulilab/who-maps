import IntroJsController from './IntroJsController';
import _ from 'lodash';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn */

let ic = {};
const createDiv =  (className, id) => {
    const elemDiv = document.createElement('div');
    elemDiv.className = className;
    elemDiv.id = id;
    return elemDiv
};


describe('introJsController', () => {

    beforeEach(() => {
        document.body.appendChild(createDiv('main', 'main-view'));
        ic = IntroJsController.introJsFactory()();
    });

    it('should have a function that can parse an object in an introJS configuration object', () => {

        ic.sourceString = {
            steps: [
                {
                    intro: '',
                    element: '.test'
                }
            ]
        };

        let result = ic.parseOptions();
        expect(result.steps.length).toBe(0);

        document.body.appendChild(createDiv('test'));
        document.body.appendChild(createDiv('test'));

        result = ic.parseOptions();
        expect(result.steps.length).toBe(1);
        expect(result.steps[0].element).toBeDefined();

        ic.sourceString.steps.push({ element: '.test' }); // invalid element
        result = ic.parseOptions();
        expect(result.steps.length).toBe(1);

        delete(ic.sourceString.steps);
        result = ic.parseOptions();
        expect(result.steps.length).toBe(0);
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
