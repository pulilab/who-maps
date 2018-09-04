import debounce from 'lodash/debounce';

export const mapGettersActions = (collection) => {
  const result = {};
  for (let item in collection) {
    const module = collection[item][0];
    const getter = module + '/' + collection[item][1];
    const setter = module + '/' + collection[item][2];
    const debounceWait = collection[item][3] ? collection[item][3] : 0;
    const setFunction = function (value) {
      this.$store.dispatch(setter, value);
    };
    const set = debounceWait ? debounce(setFunction, debounceWait) : setFunction;
    result[item] = {
      get () {
        return this.$store.getters[getter];
      },
      set
    };
  }
  return result;
};
