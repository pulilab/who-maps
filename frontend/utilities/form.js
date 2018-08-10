export const mapGettersActions = (collection) => {
  const result = {};
  for (let item in collection) {
    const module = collection[item][0];
    const getter = module + '/' + collection[item][1];
    const setter = module + '/' + collection[item][2];

    result[item] = {
      get () {
        return this.$store.getters[getter];
      },
      set (value) {
        this.$store.dispatch(setter, value);
      }
    };
  }
  return result;
};
