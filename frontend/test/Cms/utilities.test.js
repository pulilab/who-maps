import * as utilities from '../../src/Cms/utilities';
import * as mom from 'moment';

describe('CMS Utilities', () => {
  test('should have a prettifyDate fn', () => {
    jest.spyOn(mom, 'default');
    const objWithDate = {
      created: new Date('2017-01-01')
    };
    const expectedString = mom.default(objWithDate.created).format('D MMM, YYYY');
    const result = utilities.prettifyDate(objWithDate);
    // ensure that a date is passed down to moment to prevent it to default to current date
    expect(mom.default).toHaveBeenCalledWith(objWithDate.created);
    expect(result).toBe(expectedString);
  });

  test('should have an itemType Fn.', () => {
    const types = [null, 'Resources', 'Tips & Considerations', 'Experiences'];
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

  test('should have a levenshtein Fn.', () => {
    let result = utilities.levenshtein('lol', 'l');
    expect(result).toBe(2);
    result = utilities.levenshtein('lol', '');
    expect(result).toBe(3);
    result = utilities.levenshtein('', 'l');
    expect(result).toBe(1);
  });

  test('should have a fn that normalize a name', () => {
    const test = 'a & b';
    expect(utilities.normalizeName(test)).toBe('a-and-b');
  });
  test('should have a fn that add target="_blank" to every valid <a> tag', () => {
    let result = utilities.postProcessHtml('<div></div>');
    expect(result).toBe('<div></div>');
    result = utilities.postProcessHtml('<a></a>');
    expect(result).toBe('<a target="_blank"></a>');
    result = utilities.postProcessHtml('<a ></a>');
    expect(result).toBe('<a target="_blank"></a>');
    result = utilities.postProcessHtml('<a >test</a>');
    expect(result).toBe('<a target="_blank">test</a>');
    result = utilities.postProcessHtml('<a> LOL');
    expect(result).toBe('<a> LOL');
  });
});
