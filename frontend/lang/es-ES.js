import axios from 'axios';
export default () => {
  return new Promise(function (resolve) {
    axios.get('/translation/json/', {
      headers: {
        'Accept-Language': 'es'
      }
    }).then(res => {
      resolve(res.data.catalog);
    });
  });
};
