import utilities from './utilities';
import moment from 'moment';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */


describe('CMS Utilities', () => {

    it('should have a prettifyDate fn', () => {
        const objWithDate = {
            date: new Date('2017-01-01')
        };
        const expectedString = moment(objWithDate.date).format('h:m a - d MMM, YYYY');
        const result = utilities.prettifyDate(objWithDate);
        expect(result).toBe(expectedString);
    });

    it('should have an itemType Fn.', () => {
        const types = [null, 'Lessons & Tips', 'Resources', 'Experiences'];
        for (let i = 1; i < 4; i += 1) {
            const item = {
                type: i
            };
            const result = utilities.itemType(item);
            expect(result).toBe(types[i]);
        }
        const result = utilities.itemType();
        expect(result).toBe('');

    });

    it('should have a levenshtein Fn.', () => {
        const result = utilities.levenshtein('lol', 'l');
        expect(result).toBe(2);
    });


});
