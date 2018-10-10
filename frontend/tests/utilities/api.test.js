/* eslint prefer-promise-reject-errors: 0 */
import * as api from '~/utilities/api';

const emptyTest = (fn, expected) => {
  const result = fn();
  expect(result).toEqual(expected);
};

const wrongInputTest = (fn, expected) => {
  jest.spyOn(console, 'warn').mockReturnValue(null);
  let result = fn(1);
  expect(result).toEqual(expected);
  result = fn('a');
  expect(result).toEqual(expected);
  result = fn({});
  expect(result).toEqual(expected);
  expect(console.warn).toHaveBeenCalledTimes(3);
};

describe('coverageMapper', () => {
  test('returns one array with an array and an object inside', () => {
    const result = api.coverageMapper([]);
    expect(result).toEqual([[], {}]);
  });

  test('does not fail with empty input', () => {
    emptyTest(api.coverageMapper, [[], {}]);
  });

  test('does not fail with wrong input', () => {
    wrongInputTest(api.coverageMapper, [[], {}]);
  });

  test('convert an array of object', () => {
    const original = [
      {
        district: 'd',
        clients: 1,
        facilities: 2,
        health_workers: 3
      }
    ];
    const result = api.coverageMapper(original);
    expect(result[0]).toEqual(['d']);
    expect(result[1]).toEqual({
      'd': {
        clients: 1,
        facilities: 2,
        health_workers: 3,
        facilities_list: undefined
      }
    });
  });

  test('if facilities_list is present override facilities', () => {
    const original = [
      {
        district: 'd',
        clients: 1,
        facilities: 2,
        health_workers: 3,
        facilities_list: [1, 2, 3, 4]
      }
    ];
    const result = api.coverageMapper(original);
    expect(result[0]).toEqual(['d']);
    expect(result[1]).toEqual({
      'd': {
        clients: 1,
        facilities: 4,
        health_workers: 3,
        facilities_list: [1, 2, 3, 4]
      }
    });
  });
});

describe('interoperabilityLinksMapper', () => {
  test('return an object', () => {
    const result = api.interoperabilityLinksMapper([]);
    expect(result).toEqual({});
  });

  test('does not fail with empty input', () => {
    emptyTest(api.interoperabilityLinksMapper, {});
  });

  test('does not fail with wrong input', () => {
    wrongInputTest(api.interoperabilityLinksMapper, {});
  });

  test('convert an array into an object', () => {
    const original = [
      {id: 1, link: 'a', selected: true}
    ];
    const result = api.interoperabilityLinksMapper(original);
    expect(result).toEqual({1: {link: 'a', selected: true}});
  });
});

describe('platformsMapper', () => {
  test('return an array with two arrays inside', () => {
    const result = api.platformsMapper([]);
    expect(result).toEqual([[], []]);
  });

  test('does not fail with empty input', () => {
    emptyTest(api.platformsMapper, [[], []]);
  });

  test('does not fail with wrong input', () => {
    wrongInputTest(api.platformsMapper, [[], []]);
  });

  test('convert an array of objects', () => {
    const original = [
      {id: 1, strategies: [1]}
    ];
    const result = api.platformsMapper(original);
    expect(result[0]).toEqual([1]);
    expect(result[1]).toEqual([{id: 1, platform: 1}]);
  });

  test('does not fail for missing or malformed inner data', () => {
    const original = [
      {id: 1}
    ];
    let result = api.platformsMapper(original);
    expect(result).toEqual([[1], []]);

    original[0].strategies = 1;
    result = api.platformsMapper(original);
    expect(result).toEqual([[1], []]);

    original[0].strategies = '';
    result = api.platformsMapper(original);
    expect(result).toEqual([[1], []]);
  });
});
