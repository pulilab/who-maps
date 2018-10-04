import axios from 'axios';
export default () => {
  return new Promise(function (resolve) {
    axios.get('/translation/json/', {
      headers: {
        'Accept-Language': 'en'
      }
    }).then(res => {
      resolve(res.data.catalog);
    });
  });
};
