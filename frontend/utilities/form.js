import debounce from 'lodash/debounce';
import Vue from 'vue';

export const mapGettersActions = (collection) => {
  const result = {};
  for (let item in collection) {
    const [module, getterName, setterName, waitTime, skipGetter] = collection[item];
    const getter = module + '/' + getterName;
    const setter = module + '/' + setterName;
    const localValue = Vue.observable({
      value: null
    });
    const setFn = () => {
      localValue.store.dispatch(setter, localValue.value);
      debounceUpdate();
    };
    const debounceUpdate = debounce(() => {
      if (localValue && localValue.store) {
        localValue.value = localValue.store.getters[getter];
      }
    }, waitTime * 1.5);

    const set = waitTime !== null ? debounce(setFn, waitTime) : setFn;
    result[item] = {
      localValue,
      get () {
        if (skipGetter && localValue.value !== null) {
          debounceUpdate();
          return localValue.value;
        }
        return this.$store.getters[getter];
      },
      set (value) {
        localValue.value = value;
        localValue.store = this.$store;
        set();
      }
    };
  }
  return result;
};
