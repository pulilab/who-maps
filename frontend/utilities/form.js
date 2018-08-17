import debounce from 'lodash/debounce';

export const mapGettersActions = (collection) => {
  const result = {};
  for (let item in collection) {
    const module = collection[item][0];
    const getter = module + '/' + collection[item][1];
    const setter = module + '/' + collection[item][2];
    const debounceWait = collection[item][3] ? collection[item][3] : 300;
    const setFunction = function (value) {
      this.$store.dispatch(setter, value);
    };
    result[item] = {
      get () {
        return this.$store.getters[getter];
      },
      set: debounceWait ? debounce(setFunction, debounceWait) : setFunction
    };
  }
  return result;
};

export const required = (type) => ({type, required: true, message: 'This is required', trigger: 'blur'});
export const requiredList = () => ({...required(), transform: l => l.join('')});
export const max = (max) => ({max, message: `This field has to be less than ${max} characters long`, trigger: 'blur'});
export const url = () => ({type: 'url', message: 'This should be a valid url', trigger: 'blur'});
