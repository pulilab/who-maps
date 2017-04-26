import utilities from './utilities';
import moment from 'moment';

/* global define, it, describe, expect, beforeEach, afterEach, jasmine, spyOn, Promise */

const axes = require('./resources/domains');
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
        let result = utilities.levenshtein('lol', 'l');
        expect(result).toBe(2);
        result = utilities.levenshtein('lol', '');
        expect(result).toBe(3);
        result = utilities.levenshtein('', 'l');
        expect(result).toBe(1);
    });

    it('should have a fn that return an Axis name', () => {

        expect(utilities.getAxisName(0)).toBe(axes[0].name);
    });
    it('should have a fn that return a domain from his id', () => {
        const domain = axes[0].domains[0];
        expect(utilities.getDomain(domain.id).name).toBe(domain.name);

    });
    it('should have a fn that return an axis and a domainName from a domain id', ()  => {
        const domain = axes[0].domains[0];
        const r = utilities.axisAndDomainName(domain.id);
        expect(r.axisName).toBe(axes[0].name);
        expect(r.domainName).toBe(domain.name);
    });

});
