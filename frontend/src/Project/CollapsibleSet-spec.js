import CollapsibleSet from './CollapsibleSet';

/* global define, it, describe, beforeEach, afterEach, expect, xit, spyOn, Promise, jasmine */

let controller = {};

const el = window.document.createElement('div');
el.setAttribute('id', 'a');
const projectSection = window.document.createElement('div');
projectSection.classList.add('project-section');
el.appendChild(projectSection);
window.document.body.appendChild(el);
const element = [el];
const scope = {};

const timeoutFunc = window.setTimeout;

describe('CollapsibleSet class', () => {

    beforeEach(()=>{
        controller = new CollapsibleSet(element, scope, 'test');
        controller.test = {
            a: [''],
            b: [{}],
            c: {
                standard: [],
                custom: null
            }
        };
        window.setTimeout = toCall => {
            toCall();
        };
    });

    afterEach(()=> {
        window.setTimeout = timeoutFunc;
    });

    it('should have a default on init function', () => {
        spyOn(controller, 'bindElementClick');
        spyOn(controller.EE, 'emit');
        spyOn(controller.EE, 'on');
        controller.defaultOnInit();
        expect(controller.bindElementClick).toHaveBeenCalled();
        expect(controller.EE.emit).toHaveBeenCalled();
        expect(controller.EE.on).toHaveBeenCalled();
        expect(controller.elementId).toBe('a');
    });

    it('should have a default on destroy function', () => {
        spyOn(controller.EE, 'removeListener');
        controller.defaultOnDestroy();
        expect(controller.EE.removeListener).toHaveBeenCalledTimes(1);
    });

    it('should have a function that bind the click of the fieldset', () => {
        spyOn(controller.EE, 'emit');
        controller.bindElementClick();
        el.click();
        expect(controller.EE.emit).toHaveBeenCalled();
    });

    it('should have a function that toggle the class active on the fieldset', () => {
        controller.defaultOnInit();
        let hash = 'b';
        controller.activateFieldSet(hash);
        let result = controller.elementMainSection.classList.contains(controller.activateClass);
        expect(result).toBeFalsy();
        hash = 'a';
        controller.activateFieldSet(hash);
        result = controller.elementMainSection.classList.contains(controller.activateClass);
        expect(result).toBeTruthy();
    });

    it('should have a function that properly add a child to a collection ', ()=> {
        controller.addChild('a');
        expect(controller.test.a[1]).toBe('');
        controller.addChild('b');
        expect(controller.test.b[1]).toBeDefined();
    });

    it('should have a function that remove on item from a target collection', ()=> {
        controller.removeChild(0, 'a');
        expect(controller.test.a.length).toBe(0);
    });

    it('should have a function that regulate if to show the add more button', () => {
        let result = controller.showAddMore(0, controller.test.a);
        expect(result).toBeTruthy();
        controller.addChild('a');
        result = controller.showAddMore(0, controller.test.a);
        expect(result).toBeFalsy();
    });

    it('should have a function that regulate if to show the remove child button', () => {
        let result = controller.showRemove(0, [1]);
        expect(result).toBeFalsy();
        result = controller.showRemove(0, [1, 2]);
        expect(result).toBeTruthy();
    });

    it('should have a function to add the collapse class to the main section', () => {
        controller.defaultOnInit();
        let result = controller.elementMainSection.classList.contains(controller.toggleClass);
        expect(result).toBeFalsy();
        controller.collapse();
        result = controller.elementMainSection.classList.contains(controller.toggleClass);
        expect(result).toBeTruthy();
    });

    it('should have a function that find the appropriate array where to write standard results ', () => {
        let result = controller.findField('b');
        expect(result instanceof Object).toBeTruthy();
        result = controller.findField('c');
        expect(result instanceof Array).toBeTruthy();
    });

    it('should have a function that toggle a checkbox', () => {
        spyOn(controller, 'findField').and.callThrough();
        expect(controller.findField).not.toHaveBeenCalled();
        controller.checkboxToggle();
        controller.checkboxToggle(1, 'c');
        expect(controller.test.c.standard).toContain(1);
        controller.checkboxToggle(1, 'c');
        expect(controller.test.c.standard).not.toContain(1);

    });

    it('should have a function that return true if a value is present in a field', () => {
        spyOn(controller, 'findField').and.callThrough();
        controller.checkboxChecked();
        expect(controller.findField).not.toHaveBeenCalled();
        let result = controller.checkboxChecked(1, 'c');
        expect(result).toBeFalsy();
        controller.checkboxToggle(1, 'c');
        result = controller.checkboxChecked(1, 'c');
        expect(result).toBeTruthy();
    });


});
